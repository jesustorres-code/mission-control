'use client';

import { useMemo, useState } from 'react';
import PixelOctopus from '../components/PixelOctopus';

type TaskState = 'To Do' | 'In Progress' | 'Blocked' | 'Done';
type TaskFilter = 'All' | TaskState;
type MemberFilter = 'Everyone' | 'Inky' | 'Tina' | 'AI Agents' | 'Team';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

type Agent = {
  name: string;
  role: string;
  color: string;
  signal: string;
  kind: 'ai' | 'human' | 'team';
};

type Task = {
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
  tags: string[];
};

const AGENTS: Agent[] = [
  { name: 'Inky', role: 'AI Agent', color: '#fb7185', signal: 'ONLINE', kind: 'ai' },
  { name: 'Tina', role: 'Human Team', color: '#f8fafc', signal: 'LIVE', kind: 'human' },
  { name: 'Ops Team', role: 'Shared Queue', color: '#38bdf8', signal: 'SYNC', kind: 'team' },
];

const TASKS: Task[] = [
  {
    id: 'MC-101',
    title: 'Redesign visual tab — agent office with anime vibes',
    path: '/Users/tinahuang/openclaw/workspace/src/app/visual/page.tsx',
    instructions: 'Refresh the Visual tab with a cinematic agent office scene and richer realtime state.',
    context: 'Needs to preserve current navigation while improving visual hierarchy.',
    state: 'In Progress',
    owner: 'Inky',
    priority: 'High',
    sync: 'Realtime activity streaming',
    eta: '07m',
    tags: ['visual', 'anime', 'agent-office'],
  },
  {
    id: 'MC-118',
    title: 'Create task filters for Mission Control',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/app/page.tsx',
    instructions: 'Add state tabs and member filters that affect board and table views.',
    context: 'Requested from Telegram after Tasks dashboard launch.',
    state: 'To Do',
    owner: 'Inky',
    priority: 'High',
    sync: 'Queued by orchestration core',
    eta: '12m',
    tags: ['filters', 'kanban'],
  },
  {
    id: 'MC-124',
    title: 'Review task ownership model',
    path: '/Users/tinahuang/openclaw/workspace/docs/task-ownership.md',
    instructions: 'Validate whether task ownership should route to human, AI agent, or team queues.',
    context: 'Tina needs clear handoff rules before expanding automation.',
    state: 'To Do',
    owner: 'Tina',
    priority: 'Medium',
    sync: 'Waiting for graph refresh',
    eta: '24m',
    tags: ['ownership', 'routing'],
  },
  {
    id: 'MC-127',
    title: 'Wire realtime activity feed to task events',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/lib/events.ts',
    instructions: 'Prepare event shapes for task creation, claim, unblock, and completion.',
    context: 'Current feed is UI-ready; backend event integration is next.',
    state: 'In Progress',
    owner: 'Inky',
    priority: 'Medium',
    sync: 'Realtime sync active',
    eta: '18m',
    tags: ['events', 'sync'],
  },
  {
    id: 'MC-130',
    title: 'Resolve missing credential scope',
    path: '/home/ubuntu/.openclaw/workspace/.env.local',
    instructions: 'Confirm which external APIs can be accessed by AI agents.',
    context: 'Blocked until the owner approves exact credential scope.',
    state: 'Blocked',
    owner: 'Tina',
    priority: 'High',
    sync: 'Blocked on access approval',
    eta: '--',
    tags: ['security', 'access'],
  },
  {
    id: 'MC-135',
    title: 'Define team escalation lanes',
    path: '/Users/tinahuang/openclaw/workspace/ops/escalation.md',
    instructions: 'Document which blocked tasks go to humans versus shared team review.',
    context: 'Needed before enabling unattended task delegation.',
    state: 'Blocked',
    owner: 'Ops Team',
    priority: 'Medium',
    sync: 'Waiting on team dependency map',
    eta: '--',
    tags: ['team', 'blocked'],
  },
  {
    id: 'MC-099',
    title: 'Archive completed mission logs',
    path: '/home/ubuntu/.openclaw/workspace/logs/mission-control',
    instructions: 'Move completed mission traces into indexed cold storage.',
    context: 'Daily cleanup after the Mission Control deployment.',
    state: 'Done',
    owner: 'Ops Team',
    priority: 'Low',
    sync: 'Replicated to cold storage',
    eta: 'done',
    tags: ['logs', 'archive'],
  },
];

const COLUMNS: TaskState[] = ['To Do', 'In Progress', 'Blocked', 'Done'];
const FILTERS: TaskFilter[] = ['All', ...COLUMNS];
const MEMBER_FILTERS: MemberFilter[] = ['Everyone', 'Inky', 'Tina', 'AI Agents', 'Team'];

const ACTIVITY = [
  { time: '02:12:22', actor: 'Inky', event: 'claimed visual redesign and started realtime UI synthesis' },
  { time: '02:11:58', actor: 'Tina', event: 'reviewed ownership model and routed credential scope to Blocked' },
  { time: '02:10:31', actor: 'Ops Team', event: 'merged task context into the shared mission graph' },
  { time: '02:09:09', actor: 'Inky', event: 'raised visual task priority to High' },
  { time: '01:44:56', actor: 'Sync Core', event: 'reconciled 28 updates across active agents' },
];

const priorityStyles: Record<Priority, string> = {
  Critical: 'border-rose-400/50 bg-rose-500/15 text-rose-100',
  High: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  Medium: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  Low: 'border-slate-300/40 bg-slate-400/10 text-slate-200',
};

const stateAccents: Record<TaskState, string> = {
  'To Do': '#38bdf8',
  'In Progress': '#22d3ee',
  Blocked: '#fb7185',
  Done: '#34d399',
};

function AgentAvatar({ agent }: { agent: Agent }) {
  if (agent.kind === 'human') {
    return (
      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded border border-slate-200/30 bg-slate-800/80 text-[12px] font-semibold text-white shadow-[0_0_18px_rgba(148,163,184,0.16)]">
        TH
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-300" />
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 shrink-0 rounded border border-cyan-300/30 bg-slate-950/80 p-1 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
      <PixelOctopus size={30} color={agent.color} />
      <span
        className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950 blink"
        style={{ backgroundColor: agent.color }}
      />
    </div>
  );
}

function StatusPill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

function TaskCard({ task }: { task: Task }) {
  const agent = AGENTS.find((item) => item.name === task.owner) ?? AGENTS[0];

  return (
    <article className="group rounded-md border border-cyan-300/15 bg-slate-950/72 p-3 shadow-[0_0_24px_rgba(14,165,233,0.08)] transition hover:border-cyan-300/45 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">{task.id}</p>
          <h3 className="mt-1 text-[13px] font-semibold leading-snug text-slate-50">{task.title}</h3>
        </div>
        <StatusPill className={priorityStyles[task.priority]}>{task.priority}</StatusPill>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <AgentAvatar agent={agent} />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-slate-100">{task.owner}</p>
          <p className="mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{agent.role} · ETA {task.eta}</p>
        </div>
      </div>

      <p className="mt-3 rounded border border-cyan-300/10 bg-cyan-300/5 px-2 py-2 mono text-[10px] leading-relaxed text-cyan-100/80">
        {task.sync}
      </p>
      <p className="mt-2 truncate mono text-[10px] text-slate-500">{task.path}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <span key={tag} className="rounded border border-slate-500/30 px-1.5 py-1 text-[10px] text-slate-300">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function ownerMatchesFilter(task: Task, filter: MemberFilter) {
  const owner = AGENTS.find((agent) => agent.name === task.owner);

  if (filter === 'Everyone') return true;
  if (filter === 'AI Agents') return owner?.kind === 'ai';
  if (filter === 'Team') return owner?.kind === 'team';
  return task.owner === filter;
}

function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <section className="overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/68">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/15 px-4 py-3">
        <div>
          <h2 className="text-[13px] font-semibold text-white">Task Registry</h2>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">TASK · OWNER · PRIORITY · STATUS</p>
        </div>
        <StatusPill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{tasks.length} Visible</StatusPill>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-cyan-300/10 bg-slate-900/70">
            <tr className="mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const agent = AGENTS.find((item) => item.name === task.owner) ?? AGENTS[0];
              return (
                <tr key={task.id} className="border-b border-cyan-300/10 align-top hover:bg-cyan-300/5">
                  <td className="px-4 py-4">
                    <div className="max-w-[520px]">
                      <p className="text-[13px] font-semibold text-slate-50">{task.title}</p>
                      <p className="mono mt-1 truncate text-[10px] text-cyan-200/60">{task.path}</p>
                      <p className="mt-2 text-[12px] leading-relaxed text-slate-400">{task.instructions}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{task.context}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <AgentAvatar agent={agent} />
                      <div>
                        <p className="text-[12px] font-semibold text-slate-100">{task.owner}</p>
                        <p className="mono text-[10px] uppercase tracking-[0.1em] text-slate-500">{agent.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill className={priorityStyles[task.priority]}>{task.priority}</StatusPill>
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill className="border-cyan-300/40 bg-slate-900 text-cyan-100">{task.state}</StatusPill>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function TasksDashboard() {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('All');
  const [memberFilter, setMemberFilter] = useState<MemberFilter>('Everyone');
  const taskCounts = useMemo(
    () => {
      const tasksForMember = TASKS.filter((task) => ownerMatchesFilter(task, memberFilter));

      return {
        All: tasksForMember.length,
        'To Do': tasksForMember.filter((task) => task.state === 'To Do').length,
        'In Progress': tasksForMember.filter((task) => task.state === 'In Progress').length,
        Blocked: tasksForMember.filter((task) => task.state === 'Blocked').length,
        Done: tasksForMember.filter((task) => task.state === 'Done').length,
      };
    },
    [memberFilter],
  );
  const visibleColumns = activeFilter === 'All' ? COLUMNS : [activeFilter];
  const visibleTasks = TASKS.filter((task) => {
    const matchesState = activeFilter === 'All' || task.state === activeFilter;
    return matchesState && ownerMatchesFilter(task, memberFilter);
  });

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-cyan-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/75">MISSION_CONTROL · TASKS_SYNC_LIVE</p>
              <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">AI Task Operations</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill className="border-emerald-300/50 bg-emerald-400/15 text-emerald-100">Realtime</StatusPill>
              <button className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[12px] font-semibold text-cyan-50 hover:bg-cyan-300/20">
                Sync board
              </button>
              <button className="rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">
                New task
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Open tasks', '05', '+2 routed'],
              ['Members synced', '03', '28 updates'],
              ['Blocked risk', '01', 'access gate'],
              ['Automation load', '73%', 'stable'],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-4">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">{label}</p>
                <p className="mt-2 mono text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{hint}</p>
              </div>
            ))}
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={[
                      'group flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-left transition',
                      isActive
                        ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/8',
                    ].join(' ')}
                    aria-pressed={isActive}
                  >
                    <span className="text-[12px] font-semibold">{filter}</span>
                    <span
                      className={[
                        'mono rounded border px-1.5 py-0.5 text-[10px]',
                        isActive
                          ? 'border-cyan-200/40 bg-cyan-200/20 text-cyan-50'
                          : 'border-slate-600/70 bg-slate-950/70 text-slate-400 group-hover:text-cyan-100',
                      ].join(' ')}
                    >
                      {taskCounts[filter]}
                    </span>
                  </button>
                );
              })}
              </div>
              <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Owner</span>
                <select
                  value={memberFilter}
                  onChange={(event) => setMemberFilter(event.target.value as MemberFilter)}
                  className="bg-transparent text-[12px] font-semibold text-cyan-50 outline-none"
                >
                  {MEMBER_FILTERS.map((member) => (
                    <option key={member} value={member} className="bg-slate-950 text-slate-100">
                      {member}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section
            className={[
              'grid gap-3',
              activeFilter === 'All' ? 'lg:grid-cols-4' : 'lg:grid-cols-[minmax(320px,520px)]',
            ].join(' ')}
          >
            {visibleColumns.map((column) => {
              const tasks = TASKS.filter(
                (task) => task.state === column && ownerMatchesFilter(task, memberFilter),
              );
              return (
                <div key={column} className="rounded-md border border-cyan-300/15 bg-slate-900/34 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stateAccents[column] }} />
                      <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-100">{column}</h2>
                    </div>
                    <span className="mono text-[11px] text-slate-400">{tasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
                  </div>
                </div>
              );
            })}
          </section>

          <TaskTable tasks={visibleTasks} />
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-white">Agent Mesh</h2>
              <StatusPill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">3 Online</StatusPill>
            </div>
            <div className="mt-4 space-y-3">
              {AGENTS.map((agent) => (
                <div key={agent.name} className="flex items-center gap-3 rounded border border-slate-700/60 bg-slate-900/60 p-2">
                  <AgentAvatar agent={agent} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-slate-100">{agent.name}</p>
                    <p className="mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{agent.role}</p>
                  </div>
                  <span className="mono text-[11px] text-cyan-100">{agent.signal}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-white">Activity Feed</h2>
              <span className="h-2 w-2 rounded-full bg-cyan-300 blink" />
            </div>
            <div className="mt-4 space-y-3">
              {ACTIVITY.map((item) => (
                <div key={item.time} className="border-l border-cyan-300/30 pl-3">
                  <p className="mono text-[10px] text-cyan-200/75">{item.time} · {item.actor}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-300">{item.event}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Workflow Orchestration</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
              <div className="flex justify-between"><span>Human approval</span><span>armed</span></div>
              <div className="flex justify-between"><span>Agent delegation</span><span>auto</span></div>
              <div className="flex justify-between"><span>Conflict resolver</span><span>watch</span></div>
              <div className="h-2 overflow-hidden rounded bg-slate-800">
                <div className="h-full w-[73%] bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
