import PixelOctopus from '../../components/PixelOctopus';

type NodeState = 'active' | 'queued' | 'blocked' | 'done';

type OpsNode = {
  id: string;
  title: string;
  area: string;
  state: NodeState;
  x: number;
  y: number;
};

type Agent = {
  name: string;
  color: string;
  task: string;
  x: number;
  y: number;
  delay: string;
};

const NODES: OpsNode[] = [
  { id: 'MC-201', title: 'Ops Map', area: 'Visual', state: 'active', x: 12, y: 18 },
  { id: 'MC-202', title: 'Command Center', area: 'Overview', state: 'active', x: 43, y: 14 },
  { id: 'MC-203', title: 'Agent Roles', area: 'Team', state: 'queued', x: 72, y: 22 },
  { id: 'MC-204', title: 'Voice + Telegram', area: 'Settings', state: 'queued', x: 18, y: 58 },
  { id: 'MC-130', title: 'Credential Scope', area: 'Security', state: 'blocked', x: 52, y: 56 },
  { id: 'MC-099', title: 'Mission Logs', area: 'Logs', state: 'done', x: 78, y: 64 },
];

const AGENTS: Agent[] = [
  { name: 'SkyNode', color: '#22d3ee', task: 'MC-201', x: 24, y: 34, delay: '0s' },
  { name: 'Inky', color: '#fb7185', task: 'MC-202', x: 50, y: 30, delay: '0.35s' },
  { name: 'Ops Team', color: '#38bdf8', task: 'MC-099', x: 73, y: 51, delay: '0.7s' },
];

const stateStyles: Record<NodeState, string> = {
  active: 'border-cyan-300/70 bg-cyan-300/12 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.18)]',
  queued: 'border-violet-300/45 bg-violet-300/10 text-violet-100',
  blocked: 'border-rose-300/55 bg-rose-300/12 text-rose-100 shadow-[0_0_26px_rgba(251,113,133,0.12)]',
  done: 'border-emerald-300/45 bg-emerald-300/10 text-emerald-100',
};

function OpsAgent({ agent }: { agent: Agent }) {
  return (
    <div
      className="agent-drift absolute z-20 w-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${agent.x}%`, top: `${agent.y}%`, animationDelay: agent.delay }}
    >
      <div className="mx-auto h-12 w-12 rounded border border-cyan-300/30 bg-slate-950/90 p-1 shadow-[0_0_24px_rgba(34,211,238,0.2)]">
        <PixelOctopus size={38} color={agent.color} />
      </div>
      <div className="mt-2 rounded border border-slate-500/30 bg-slate-950/90 px-2 py-1 text-center">
        <p className="truncate text-[10px] font-semibold text-white">{agent.name}</p>
        <p className="mono text-[9px] uppercase tracking-[0.12em] text-cyan-200/75">{agent.task}</p>
      </div>
    </div>
  );
}

export default function VisualPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Visual / Ops Map</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Live Operations Map</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              A wall-map representation of tasks, workflows and agents moving toward the work they are handling.
            </p>
          </div>
          <div className="rounded-md border border-violet-300/25 bg-violet-300/10 px-3 py-2 mono text-[11px] text-violet-100">
            PIXEL MODE ACTIVE
          </div>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-5 xl:grid-cols-[1fr_320px]">
        <div className="relative min-h-[620px] overflow-hidden rounded-md border border-cyan-300/20 bg-slate-950 shadow-[0_0_40px_rgba(14,165,233,0.09)] pixel-grid">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_70%_65%,rgba(167,139,250,0.12),transparent_24%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
            <line x1="18%" y1="24%" x2="47%" y2="20%" stroke="rgba(34,211,238,0.35)" strokeDasharray="5 6" />
            <line x1="47%" y1="20%" x2="75%" y2="28%" stroke="rgba(167,139,250,0.35)" strokeDasharray="5 6" />
            <line x1="20%" y1="64%" x2="54%" y2="62%" stroke="rgba(251,113,133,0.28)" strokeDasharray="5 6" />
            <line x1="54%" y1="62%" x2="80%" y2="69%" stroke="rgba(52,211,153,0.28)" strokeDasharray="5 6" />
            <line x1="47%" y1="20%" x2="54%" y2="62%" stroke="rgba(34,211,238,0.24)" strokeDasharray="3 8" />
          </svg>

          {NODES.map((node) => (
            <article
              key={node.id}
              className={`absolute z-10 w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border p-3 ${stateStyles[node.state]}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="mono text-[10px] uppercase tracking-[0.14em] opacity-80">{node.id}</p>
                <span className="h-2 w-2 rounded-full bg-current blink" />
              </div>
              <h2 className="mt-2 text-[13px] font-semibold leading-snug text-white">{node.title}</h2>
              <p className="mt-1 mono text-[9px] uppercase tracking-[0.12em] opacity-75">{node.area} / {node.state}</p>
            </article>
          ))}

          {AGENTS.map((agent) => (
            <OpsAgent key={agent.name} agent={agent} />
          ))}
        </div>

        <aside className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
          <h2 className="text-sm font-semibold text-white">Map Legend</h2>
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
              {AGENTS.map((agent) => (
                <div key={agent.name} className="rounded border border-slate-500/20 bg-slate-900/60 p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: agent.color }} />
                    <span className="text-xs font-semibold text-white">{agent.name}</span>
                  </div>
                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Assigned to {agent.task}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
