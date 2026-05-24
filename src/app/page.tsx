'use client';

type Status = 'Healthy' | 'Watching' | 'Blocked' | 'Done';

type CommandSignal = {
  label: string;
  value: string;
  detail: string;
  status: Status;
};

type QueueItem = {
  id: string;
  title: string;
  owner: string;
  area: string;
  state: string;
  urgency: string;
};

const SIGNALS: CommandSignal[] = [
  {
    label: 'Mission Control',
    value: 'LIVE',
    detail: 'Next.js app, Cloudflare tunnel, systemd runtime',
    status: 'Healthy',
  },
  {
    label: 'Active Work',
    value: '7',
    detail: 'Tasks, Docs, Memory, Team, Visual/Ops Map',
    status: 'Watching',
  },
  {
    label: 'Operator',
    value: 'Guillermo',
    detail: 'Telegram direction, approvals, product judgment',
    status: 'Healthy',
  },
  {
    label: 'Open Decisions',
    value: '2',
    detail: 'Backend persistence and real agent telemetry',
    status: 'Blocked',
  },
];

const QUEUE: QueueItem[] = [
  {
    id: 'MC-201',
    title: 'Turn Visual into an Ops Map with moving agents',
    owner: 'SkyNode',
    area: 'Visual',
    state: 'In Progress',
    urgency: 'High',
  },
  {
    id: 'MC-202',
    title: 'Use Overview as the command center instead of another task board',
    owner: 'SkyNode',
    area: 'Overview',
    state: 'In Progress',
    urgency: 'High',
  },
  {
    id: 'MC-203',
    title: 'Fold standalone Agents into Team orchestration',
    owner: 'SkyNode',
    area: 'Team',
    state: 'Queued',
    urgency: 'Medium',
  },
  {
    id: 'MC-204',
    title: 'Prepare Settings for voice, Telegram, models and integrations',
    owner: 'Ops Team',
    area: 'Settings',
    state: 'Planned',
    urgency: 'Medium',
  },
];

const ACTIVITY = [
  'Visual promoted from empty menu to Ops Map concept',
  'Agents folded into Team to avoid duplicate ownership views',
  'Logs defined as the operational audit trail',
  'Memory, Docs and Projects remain source-backed knowledge modules',
  'Next milestone: live data, persistence and real actions',
];

const statusStyles: Record<Status, string> = {
  Healthy: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  Watching: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  Blocked: 'border-rose-300/50 bg-rose-400/15 text-rose-100',
  Done: 'border-slate-300/40 bg-slate-400/10 text-slate-100',
};

function Pill({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Overview</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Command Center</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Unified operating view for Guillermo&apos;s projects, tasks, memory, agents, automation and deployment health.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 mono text-[11px] text-cyan-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300 blink" />
            SYSTEM ONLINE
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-6 py-5 xl:grid-cols-4">
        {SIGNALS.map((signal) => (
          <article key={signal.label} className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4 shadow-[0_0_26px_rgba(14,165,233,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <p className="mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{signal.label}</p>
              <Pill className={statusStyles[signal.status]}>{signal.status}</Pill>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{signal.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">{signal.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 px-6 pb-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-md border border-cyan-300/15 bg-slate-950/65">
          <div className="flex items-center justify-between border-b border-cyan-300/10 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-white">Priority Queue</h2>
              <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Current operating focus</p>
            </div>
            <Pill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">4 ACTIVE</Pill>
          </div>
          <div className="divide-y divide-cyan-300/10">
            {QUEUE.map((item) => (
              <div key={item.id} className="grid gap-3 px-4 py-3 md:grid-cols-[0.7fr_2fr_0.8fr_0.8fr_0.7fr]">
                <span className="mono text-[11px] text-cyan-200/80">{item.id}</span>
                <span className="text-sm font-medium text-slate-100">{item.title}</span>
                <span className="text-xs text-slate-400">{item.owner}</span>
                <span className="text-xs text-slate-400">{item.area}</span>
                <span className="mono text-[10px] uppercase tracking-[0.12em] text-cyan-100">{item.state}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-md border border-violet-300/15 bg-slate-950/65 p-4">
          <h2 className="text-sm font-semibold text-white">Operator Feed</h2>
          <p className="mt-1 mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Latest system decisions</p>
          <div className="mt-4 space-y-3">
            {ACTIVITY.map((event, index) => (
              <div key={event} className="flex gap-3 rounded border border-cyan-300/10 bg-cyan-300/5 p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                <div>
                  <p className="mono text-[10px] text-slate-500">T-{index + 1}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
