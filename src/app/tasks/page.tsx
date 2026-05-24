'use client';

import { useEffect, useMemo, useState } from 'react';
import PixelOctopus from '../../components/PixelOctopus';
import { AGENTS, COLUMNS, FILTERS, MEMBER_FILTERS, type Agent, type MemberFilter, type Priority, type Task, type TaskFilter, type TaskState } from '../../lib/mission-control';

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

function newTaskId(tasks: Task[]) {
  const next = Math.max(205, ...tasks.map((task) => Number(task.id.replace('MC-', ''))).filter(Number.isFinite)) + 1;
  return `MC-${next}`;
}

function createBlankTask(tasks: Task[]): Task {
  return {
    id: newTaskId(tasks),
    title: 'New Mission Control task',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control',
    instructions: 'Define the next concrete action for this task.',
    context: 'Created from the persistent Tasks interface.',
    state: 'To Do',
    owner: 'SkyNode',
    priority: 'Medium',
    sync: 'Created from Mission Control UI',
    eta: '30m',
    tags: ['new-task'],
  };
}

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
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950 blink" style={{ backgroundColor: agent.color }} />
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

function ownerMatchesFilter(task: Task, filter: MemberFilter) {
  const owner = AGENTS.find((agent) => agent.name === task.owner);

  if (filter === 'Everyone') return true;
  if (filter === 'AI Agents') return owner?.kind === 'ai';
  if (filter === 'Team') return owner?.kind === 'team';
  return task.owner === filter;
}

function TaskCard({ task, onSelect }: { task: Task; onSelect: (task: Task) => void }) {
  const agent = AGENTS.find((item) => item.name === task.owner) ?? AGENTS[0];

  return (
    <button
      type="button"
      onClick={() => onSelect(task)}
      className="group w-full rounded-md border border-cyan-300/15 bg-slate-950/72 p-3 text-left shadow-[0_0_24px_rgba(14,165,233,0.08)] transition hover:border-cyan-300/45 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
    >
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
      <p className="mt-3 rounded border border-cyan-300/10 bg-cyan-300/5 px-2 py-2 mono text-[10px] leading-relaxed text-cyan-100/80">{task.sync}</p>
      <p className="mt-2 truncate mono text-[10px] text-slate-500">{task.path}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.tags.map((tag) => (
          <span key={tag} className="rounded border border-slate-500/30 px-1.5 py-1 text-[10px] text-slate-300">{tag}</span>
        ))}
      </div>
    </button>
  );
}

function TaskDetail({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (task: Task) => void }) {
  const [draft, setDraft] = useState<Task>(task);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(task);
  }, [task]);

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-[420px] overflow-y-auto border-l border-cyan-300/20 bg-slate-950/95 p-5 shadow-[0_0_42px_rgba(14,165,233,0.18)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">{draft.id}</p>
          <h2 className="mt-2 text-xl font-semibold leading-tight text-white">{draft.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300 hover:border-cyan-300 hover:text-cyan-100">Close</button>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Title</span>
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none" />
        </label>
        <label className="grid gap-1">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">State</span>
          <select value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value as TaskState })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
            {COLUMNS.map((state) => <option key={state}>{state}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Owner</span>
          <select value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
            {AGENTS.map((agent) => <option key={agent.name}>{agent.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Priority</span>
          <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
            {['Critical', 'High', 'Medium', 'Low'].map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">ETA</span>
          <input value={draft.eta} onChange={(event) => setDraft({ ...draft, eta: event.target.value })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none" />
        </label>
      </div>

      <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Instructions</h3>
          <textarea value={draft.instructions} onChange={(event) => setDraft({ ...draft, instructions: event.target.value })} rows={4} className="mt-2 w-full rounded border border-cyan-300/10 bg-cyan-300/5 p-3 text-sm text-slate-100 outline-none" />
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Context</h3>
          <textarea value={draft.context} onChange={(event) => setDraft({ ...draft, context: event.target.value })} rows={4} className="mt-2 w-full rounded border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 outline-none" />
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Path</h3>
          <input value={draft.path} onChange={(event) => setDraft({ ...draft, path: event.target.value })} className="mt-2 w-full rounded border border-slate-700 bg-slate-900/70 p-3 mono text-xs text-slate-100 outline-none" />
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Sync</h3>
          <input value={draft.sync} onChange={(event) => setDraft({ ...draft, sync: event.target.value })} className="mt-2 w-full rounded border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 outline-none" />
        </section>
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">Tags</h3>
          <input value={draft.tags.join(', ')} onChange={(event) => setDraft({ ...draft, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} className="mt-2 w-full rounded border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-100 outline-none" />
        </section>
        <button type="button" onClick={() => onSave(draft)} className="w-full rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">Save task</button>
      </div>
    </aside>
  );
}

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('All');
  const [memberFilter, setMemberFilter] = useState<MemberFilter>('Everyone');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [status, setStatus] = useState('Loading MySQL-backed tasks...');

  async function loadTasks() {
    const response = await fetch('/api/tasks', { cache: 'no-store' });
    const data = await response.json() as { tasks?: Task[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? 'Unable to load tasks');
    setTasks(data.tasks ?? []);
    setStatus('MySQL sync active');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load tasks'));
  }, []);

  async function saveTask(task: Task) {
    const exists = tasks.some((item) => item.id === task.id);
    const response = await fetch(exists ? `/api/tasks/${task.id}` : '/api/tasks', {
      method: exists ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const data = await response.json() as { task?: Task; error?: string };
    if (!response.ok || !data.task) {
      setStatus(data.error ?? 'Task save failed');
      return;
    }
    setTasks((current) => exists ? current.map((item) => item.id === task.id ? data.task! : item) : [data.task!, ...current]);
    setSelectedTask(data.task);
    setStatus(`Saved ${task.id} to MySQL`);
  }

  const taskCounts = useMemo(() => {
    const tasksForMember = tasks.filter((task) => ownerMatchesFilter(task, memberFilter));
    return {
      All: tasksForMember.length,
      'To Do': tasksForMember.filter((task) => task.state === 'To Do').length,
      'In Progress': tasksForMember.filter((task) => task.state === 'In Progress').length,
      Blocked: tasksForMember.filter((task) => task.state === 'Blocked').length,
      Done: tasksForMember.filter((task) => task.state === 'Done').length,
    };
  }, [memberFilter, tasks]);

  const visibleColumns = activeFilter === 'All' ? COLUMNS : [activeFilter];
  const visibleTasks = tasks.filter((task) => (activeFilter === 'All' || task.state === activeFilter) && ownerMatchesFilter(task, memberFilter));

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-cyan-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/75">MISSION_CONTROL · MYSQL_TASKS_LIVE</p>
              <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">AI Task Operations</h1>
              <p className="mt-1 text-xs text-slate-400">{status}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill className="border-emerald-300/50 bg-emerald-400/15 text-emerald-100">Persistent</StatusPill>
              <button type="button" onClick={loadTasks} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[12px] font-semibold text-cyan-50 hover:bg-cyan-300/20">Sync board</button>
              <button type="button" onClick={() => setSelectedTask(createBlankTask(tasks))} className="rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">New task</button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Open tasks', String(tasks.filter((task) => task.state !== 'Done').length).padStart(2, '0'), 'MySQL live'],
              ['Members synced', String(AGENTS.length).padStart(2, '0'), 'agent registry'],
              ['Blocked risk', String(taskCounts.Blocked).padStart(2, '0'), 'access gates'],
              ['Completed', String(taskCounts.Done).padStart(2, '0'), 'persistent state'],
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
                    <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={['group flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-left transition', isActive ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]' : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/8'].join(' ')} aria-pressed={isActive}>
                      <span className="text-[12px] font-semibold">{filter}</span>
                      <span className="mono rounded border border-slate-600/70 bg-slate-950/70 px-1.5 py-0.5 text-[10px] text-slate-300">{taskCounts[filter]}</span>
                    </button>
                  );
                })}
              </div>
              <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-700/70 bg-slate-900/70 px-3 py-2">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Owner</span>
                <select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value as MemberFilter)} className="bg-transparent text-[12px] font-semibold text-cyan-50 outline-none">
                  {MEMBER_FILTERS.map((member) => <option key={member} value={member} className="bg-slate-950 text-slate-100">{member}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className={['grid gap-3', activeFilter === 'All' ? 'lg:grid-cols-4' : 'lg:grid-cols-[minmax(320px,520px)]'].join(' ')}>
            {visibleColumns.map((column) => {
              const columnTasks = tasks.filter((task) => task.state === column && ownerMatchesFilter(task, memberFilter));
              return (
                <div key={column} className="rounded-md border border-cyan-300/15 bg-slate-900/34 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stateAccents[column] }} />
                      <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-100">{column}</h2>
                    </div>
                    <span className="mono text-[11px] text-slate-400">{columnTasks.length}</span>
                  </div>
                  <div className="space-y-3">{columnTasks.map((task) => <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />)}</div>
                </div>
              );
            })}
          </section>

          <section className="overflow-hidden rounded-md border border-cyan-300/15 bg-slate-950/68">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/15 px-4 py-3">
              <div>
                <h2 className="text-[13px] font-semibold text-white">Task Registry</h2>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Click any row to open persistent detail</p>
              </div>
              <StatusPill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{visibleTasks.length} Visible</StatusPill>
            </div>
            <div className="divide-y divide-cyan-300/10">
              {visibleTasks.map((task) => (
                <button key={task.id} type="button" onClick={() => setSelectedTask(task)} className="grid w-full gap-3 px-4 py-3 text-left hover:bg-cyan-300/5 md:grid-cols-[1.1fr_0.7fr_0.5fr_0.5fr]">
                  <span><span className="block text-[13px] font-semibold text-slate-50">{task.title}</span><span className="mono mt-1 block truncate text-[10px] text-cyan-200/60">{task.path}</span></span>
                  <span className="text-xs text-slate-300">{task.owner}</span>
                  <StatusPill className={priorityStyles[task.priority]}>{task.priority}</StatusPill>
                  <StatusPill className="border-cyan-300/40 bg-slate-900 text-cyan-100">{task.state}</StatusPill>
                </button>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold text-white">Agent Mesh</h2><StatusPill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{AGENTS.length} Online</StatusPill></div>
            <div className="mt-4 space-y-3">{AGENTS.map((agent) => <div key={agent.name} className="flex items-center gap-3 rounded border border-slate-700/60 bg-slate-900/60 p-2"><AgentAvatar agent={agent} /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-slate-100">{agent.name}</p><p className="mono text-[10px] uppercase tracking-[0.1em] text-slate-400">{agent.role}</p></div><span className="mono text-[11px] text-cyan-100">{agent.signal}</span></div>)}</div>
          </section>
          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Core Backend</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
              <div className="flex justify-between"><span>Database</span><span>mysql</span></div>
              <div className="flex justify-between"><span>Tasks API</span><span>live</span></div>
              <div className="flex justify-between"><span>Logs API</span><span>live</span></div>
              <div className="h-2 overflow-hidden rounded bg-slate-800"><div className="h-full w-[82%] bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" /></div>
            </div>
          </section>
        </aside>
      </div>

      {selectedTask && <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} onSave={saveTask} />}
    </div>
  );
}
