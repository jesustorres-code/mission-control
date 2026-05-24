import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { SEED_LOGS, SEED_PROJECTS, SEED_SETTINGS, SEED_TASKS, type LogEntry, type LogLevel, type Priority, type Project, type ProjectCategory, type ProjectStatus, type SettingGroup, type Task, type TaskState } from './mission-control';

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

type SettingRow = RowDataPacket & {
  id: string;
  title: string;
  status: 'Configured' | 'Planned' | 'Active';
  items_json: string[] | string;
  updated_at: Date;
};

type ProjectRow = RowDataPacket & {
  id: string;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number;
  created: string;
  repo: string;
  route: string;
  summary: string;
  agents_json: string[] | string;
  pipelines_json: string[] | string;
  metrics_json: Array<[string, string]> | string;
  activity: string;
  updated_at: Date;
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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings_groups (
      id VARCHAR(80) PRIMARY KEY,
      title VARCHAR(160) NOT NULL,
      status ENUM('Configured', 'Planned', 'Active') NOT NULL DEFAULT 'Planned',
      items_json JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(180) NOT NULL,
      status ENUM('ACTIVE', 'DEPLOYING', 'PLANNING', 'REVIEW', 'PAUSED') NOT NULL DEFAULT 'PLANNING',
      category ENUM('AI System', 'Product', 'Content Pipeline', 'Infrastructure', 'Research') NOT NULL DEFAULT 'Product',
      progress INT NOT NULL DEFAULT 0,
      created VARCHAR(40) NOT NULL,
      repo VARCHAR(255) NOT NULL,
      route VARCHAR(512) NOT NULL,
      summary TEXT NOT NULL,
      agents_json JSON NOT NULL,
      pipelines_json JSON NOT NULL,
      metrics_json JSON NOT NULL,
      activity TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_projects_status (status)
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

  const [[settingsCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM settings_groups');
  if (Number(settingsCount.count) === 0) {
    for (const group of SEED_SETTINGS) {
      await upsertSettingGroup(group, false);
    }
  }

  const [[projectCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM projects');
  if (Number(projectCount.count) === 0) {
    for (const project of SEED_PROJECTS) {
      await upsertProject(project, false);
    }
  }
}

function readJson<T>(value: T | string, fallback: T): T {
  if (Array.isArray(value)) return value as T;
  if (!value) return fallback;
  if (typeof value === 'string') return JSON.parse(value) as T;
  return value as T;
}

function mapTask(row: TaskRow): Task {
  const tags = readJson<string[]>(row.tags_json, []);

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

function mapSetting(row: SettingRow): SettingGroup {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    items: readJson<string[]>(row.items_json, []),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    category: row.category,
    progress: Number(row.progress),
    created: row.created,
    repo: row.repo,
    route: row.route,
    summary: row.summary,
    agents: readJson<string[]>(row.agents_json, []),
    pipelines: readJson<string[]>(row.pipelines_json, []),
    metrics: readJson<Array<[string, string]>>(row.metrics_json, []),
    activity: row.activity,
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

export async function listSettings() {
  await ensureSchema();
  const [rows] = await getPool().query<SettingRow[]>("SELECT * FROM settings_groups ORDER BY FIELD(status, 'Configured', 'Active', 'Planned'), title");
  return rows.map(mapSetting);
}

export async function upsertSettingGroup(group: SettingGroup, writeLog = true) {
  await getPool().execute(
    `INSERT INTO settings_groups (id, title, status, items_json)
     VALUES (:id, :title, :status, CAST(:items AS JSON))
     ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status), items_json = VALUES(items_json)`,
    { ...group, items: JSON.stringify(group.items) },
  );

  if (writeLog) {
    await createLog({
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
      actor: 'Mission Control',
      level: 'ACTION',
      area: 'Settings',
      message: `Settings group ${group.id} saved with status ${group.status}.`,
      source: 'api:/api/settings',
    });
  }
}

export async function listProjects() {
  await ensureSchema();
  const [rows] = await getPool().query<ProjectRow[]>("SELECT * FROM projects ORDER BY FIELD(status, 'DEPLOYING', 'ACTIVE', 'REVIEW', 'PLANNING', 'PAUSED'), progress DESC");
  return rows.map(mapProject);
}

export async function upsertProject(project: Project, writeLog = true) {
  await getPool().execute(
    `INSERT INTO projects (id, name, status, category, progress, created, repo, route, summary, agents_json, pipelines_json, metrics_json, activity)
     VALUES (:id, :name, :status, :category, :progress, :created, :repo, :route, :summary, CAST(:agents AS JSON), CAST(:pipelines AS JSON), CAST(:metrics AS JSON), :activity)
     ON DUPLICATE KEY UPDATE
      name = VALUES(name), status = VALUES(status), category = VALUES(category), progress = VALUES(progress),
      created = VALUES(created), repo = VALUES(repo), route = VALUES(route), summary = VALUES(summary),
      agents_json = VALUES(agents_json), pipelines_json = VALUES(pipelines_json), metrics_json = VALUES(metrics_json), activity = VALUES(activity)`,
    {
      ...project,
      agents: JSON.stringify(project.agents),
      pipelines: JSON.stringify(project.pipelines),
      metrics: JSON.stringify(project.metrics),
    },
  );

  if (writeLog) {
    await createLog({
      time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
      actor: 'Mission Control',
      level: 'ACTION',
      area: 'Projects',
      message: `Project ${project.id} saved with status ${project.status} and ${project.progress}% progress.`,
      source: 'api:/api/projects',
    });
  }
}
