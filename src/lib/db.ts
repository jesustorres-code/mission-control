import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { SEED_LOGS, SEED_TASKS, type LogEntry, type LogLevel, type Priority, type Task, type TaskState } from './mission-control';

type TaskRow = RowDataPacket & {
  id: string;
  title: string;
  path: string;
  instructions: string;
  context: string;
  state: TaskState;
  owner: string;
  priority: Priority;
  sync: string;
  eta: string;
  tags_json: string;
  created_at: Date;
  updated_at: Date;
};

type LogRow = RowDataPacket & {
  id: number;
  time_label: string;
  actor: string;
  level: LogLevel;
  area: string;
  message: string;
  source: string;
  created_at: Date;
};

const globalForDb = globalThis as typeof globalThis & { missionControlPool?: Pool };

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getPool() {
  if (!globalForDb.missionControlPool) {
    globalForDb.missionControlPool = mysql.createPool({
      host: requiredEnv('MYSQL_HOST'),
      port: Number(process.env.MYSQL_PORT ?? '3306'),
      database: requiredEnv('MYSQL_DATABASE'),
      user: requiredEnv('MYSQL_USER'),
      password: requiredEnv('MYSQL_PASSWORD'),
      waitForConnections: true,
      connectionLimit: 8,
      namedPlaceholders: true,
    });
  }

  return globalForDb.missionControlPool;
}

export async function ensureSchema() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(32) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      path VARCHAR(512) NOT NULL,
      instructions TEXT NOT NULL,
      context TEXT NOT NULL,
      state ENUM('To Do', 'In Progress', 'Blocked', 'Done') NOT NULL DEFAULT 'To Do',
      owner VARCHAR(80) NOT NULL,
      priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
      sync VARCHAR(255) NOT NULL,
      eta VARCHAR(40) NOT NULL,
      tags_json JSON NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_state (state),
      INDEX idx_tasks_owner (owner)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS operation_logs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      time_label VARCHAR(40) NOT NULL,
      actor VARCHAR(80) NOT NULL,
      level ENUM('INFO', 'ACTION', 'WARN', 'DONE') NOT NULL DEFAULT 'INFO',
      area VARCHAR(80) NOT NULL,
      message TEXT NOT NULL,
      source VARCHAR(160) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_logs_created_at (created_at),
      INDEX idx_logs_area (area)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [[taskCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM tasks');
  if (Number(taskCount.count) === 0) {
    for (const task of SEED_TASKS) {
      await upsertTask(task, false);
    }
  }

  const [[logCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM operation_logs');
  if (Number(logCount.count) === 0) {
    for (const log of SEED_LOGS) {
      await createLog(log);
    }
  }
}

function mapTask(row: TaskRow): Task {
  const tags = Array.isArray(row.tags_json)
    ? row.tags_json
    : JSON.parse(row.tags_json || '[]') as string[];

  return {
    id: row.id,
    title: row.title,
    path: row.path,
    instructions: row.instructions,
    context: row.context,
    state: row.state,
    owner: row.owner,
    priority: row.priority,
    sync: row.sync,
    eta: row.eta,
    tags,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapLog(row: LogRow): LogEntry {
  return {
    id: row.id,
    time: row.time_label,
    actor: row.actor,
    level: row.level,
    area: row.area,
    message: row.message,
    source: row.source,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listTasks() {
  await ensureSchema();
  const [rows] = await getPool().query<TaskRow[]>('SELECT * FROM tasks ORDER BY FIELD(state, \'In Progress\', \'To Do\', \'Blocked\', \'Done\'), updated_at DESC');
  return rows.map(mapTask);
}

export async function upsertTask(task: Task, writeLog = true) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO tasks (id, title, path, instructions, context, state, owner, priority, sync, eta, tags_json)
     VALUES (:id, :title, :path, :instructions, :context, :state, :owner, :priority, :sync, :eta, CAST(:tags AS JSON))
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       path = VALUES(path),
       instructions = VALUES(instructions),
       context = VALUES(context),
       state = VALUES(state),
       owner = VALUES(owner),
       priority = VALUES(priority),
       sync = VALUES(sync),
       eta = VALUES(eta),
       tags_json = VALUES(tags_json)`,
    { ...task, tags: JSON.stringify(task.tags) },
  );

  if (writeLog) {
    await createLog({
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
      actor: 'Mission Control',
      level: 'ACTION',
      area: 'Tasks',
      message: `Task ${task.id} saved with state ${task.state} and owner ${task.owner}.`,
      source: 'api:/api/tasks',
    });
  }
}

export async function updateTask(id: string, patch: Partial<Task>) {
  await ensureSchema();
  const tasks = await listTasks();
  const current = tasks.find((task) => task.id === id);
  if (!current) return null;

  const next: Task = {
    ...current,
    ...patch,
    id: current.id,
    tags: patch.tags ?? current.tags,
  };

  await upsertTask(next, false);
  await createLog({
    time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
    actor: 'Mission Control',
    level: 'ACTION',
    area: 'Tasks',
    message: `Task ${id} updated: state ${next.state}, owner ${next.owner}, priority ${next.priority}.`,
    source: `api:/api/tasks/${id}`,
  });

  return next;
}

export async function listLogs(limit = 50) {
  await ensureSchema();
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
  const [rows] = await getPool().query<LogRow[]>(`SELECT * FROM operation_logs ORDER BY created_at DESC, id DESC LIMIT ${safeLimit}`);
  return rows.map(mapLog);
}

export async function createLog(log: Omit<LogEntry, 'id'>) {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO operation_logs (time_label, actor, level, area, message, source)
     VALUES (:time, :actor, :level, :area, :message, :source)`,
    log,
  );
}
