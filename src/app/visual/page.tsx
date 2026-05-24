'use client';

import { useEffect, useMemo, useState } from 'react';
import PixelOctopus from '../../components/PixelOctopus';
import { AGENTS, type Task, type TaskState } from '../../lib/mission-control';

type NodeState = 'active' | 'queued' | 'blocked' | 'done';

const stateStyles: Record<NodeState, string> = {
  active: 'border-cyan-300/70 bg-cyan-300/12 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]',
  queued: 'border-violet-300/45 bg-violet-300/10 text-violet-100',
  blocked: 'border-rose-300/55 bg-rose-300/12 text-rose-100 shadow-[0_0_26px_rgba(251,113,133,0.12)]',
  done: 'border-emerald-300/45 bg-emerald-300/10 text-emerald-100',
};

const positions = [
  [12, 18],
  [43, 14],
  [72, 22],
  [18, 58],
  [52, 56],
  [78, 64],
  [35, 78],
  [64, 82],
] as const;

function mapState(state: TaskState): NodeState {
  if (state === 'In Progress') return 'active';
  if (state === 'Blocked') return 'blocked';
  if (state === 'Done') return 'done';
  return 'queued';
}

function OpsAgent({ name, color, task, x, y, delay }: { name: string; color: string; task: string; x: number; y: number; delay: string }) {
  return (
    <div className="agent-drift absolute z-20 w-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%`, animationDelay: delay }}>
      <div className="mx-auto h-12 w-12 rounded border border-cyan-300/30 bg-slate-950/90 p-1 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
        <PixelOctopus size={38} color={color} />
      </div>
      <div className="mt-2 rounded border border-slate-500/30 bg-slate-950/90 px-2 py-1 text-center">
        <p className="truncate text-[10px] font-semibold text-white">{name}</p>
        <p className="mono text-[9px] uppercase tracking-[0.12em] text-cyan-200/75">{task}</p>
      </div>
    </div>
  );
}

export default function VisualPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState('Loading Ops Map from MySQL...');

  async function loadTasks() {
    const response = await fetch('/api/tasks', { cache: 'no-store' });
    const data = await response.json() as { tasks?: Task[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? 'Unable to load tasks');
    setTasks(data.tasks ?? []);
    setStatus('Ops Map connected to MySQL task state');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load tasks'));
  }, []);

  const nodes = useMemo(() => tasks.slice(0, positions.length).map((task, index) => ({
    task,
    x: positions[index][0],
    y: positions[index][1],
    state: mapState(task.state),
  })), [tasks]);

  const activeAgents = useMemo(() => {
    return AGENTS.map((agent, index) => {
      const assigned = nodes.find((node) => node.task.owner === agent.name && node.task.state === 'In Progress')
        ?? nodes.find((node) => node.task.owner === agent.name)
        ?? nodes[index % Math.max(nodes.length, 1)];
      return { agent, assigned, delay: `${index * 0.35}s` };
    }).filter((item) => item.assigned);
  }, [nodes]);

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Visual / Ops Map</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Live Operations Map</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">A wall-map representation of MySQL-backed tasks and agents moving toward assigned work.</p>
          </div>
          <button type="button" onClick={loadTasks} className="rounded-md border border-violet-300/25 bg-violet-300/10 px-3 py-2 mono text-[11px] text-violet-100 hover:bg-violet-300/20">SYNC MYSQL</button>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-5 xl:grid-cols-[1fr_320px]">
        <div className="relative min-h-[620px] overflow-hidden rounded-md border border-cyan-300/20 bg-slate-950 shadow-[0_0_40px_rgba(14,165,233,0.09)] pixel-grid">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_70%_65%,rgba(167,139,250,0.12),transparent_24%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
            {nodes.slice(0, -1).map((node, index) => {
              const next = nodes[index + 1];
              return <line key={node.task.id} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${next.x}%`} y2={`${next.y}%`} stroke="rgba(34,211,238,0.32)" strokeDasharray="5 6" />;
            })}
          </svg>

          {nodes.map((node) => (
            <article key={node.task.id} className={`absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border p-3 ${stateStyles[node.state]}`} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
              <div className="flex items-start justify-between gap-2">
                <p className="mono text-[10px] uppercase tracking-[0.14em] opacity-80">{node.task.id}</p>
                <span className="h-2 w-2 rounded-full bg-current blink" />
              </div>
              <h2 className="mt-2 text-[13px] font-semibold leading-snug text-white">{node.task.title}</h2>
              <p className="mt-1 mono text-[9px] uppercase tracking-[0.12em] opacity-75">{node.task.owner} / {node.state}</p>
            </article>
          ))}

          {activeAgents.map(({ agent, assigned, delay }) => (
            <OpsAgent key={agent.name} name={agent.name} color={agent.color} task={assigned.task.id} x={assigned.x + 8} y={assigned.y + 13} delay={delay} />
          ))}
        </div>

        <aside className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
          <h2 className="text-sm font-semibold text-white">Map Legend</h2>
          <p className="mt-2 text-xs leading-5 text-slate-400">{status}</p>
          <div className="mt-4 space-y-3">
            {Object.entries(stateStyles).map(([state, className]) => (
              <div key={state} className="flex items-center justify-between rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2">
                <span className="capitalize text-xs text-slate-300">{state}</span>
                <span className={`rounded border px-2 py-1 mono text-[9px] uppercase tracking-[0.12em] ${className}`}>node</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-cyan-300/10 pt-4">
            <h3 className="text-sm font-semibold text-white">Agent Assignments</h3>
            <div className="mt-3 space-y-3">
              {activeAgents.map(({ agent, assigned }) => (
                <div key={agent.name} className="rounded border border-slate-500/20 bg-slate-900/60 p-3">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: agent.color }} /><span className="text-xs font-semibold text-white">{agent.name}</span></div>
                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Assigned to {assigned.task.id}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
