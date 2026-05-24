type LogLevel = 'INFO' | 'ACTION' | 'WARN' | 'DONE';

type LogEntry = {
  time: string;
  actor: string;
  level: LogLevel;
  area: string;
  message: string;
  source: string;
};

const LOGS: LogEntry[] = [
  {
    time: '11:14',
    actor: 'SkyNode',
    level: 'ACTION',
    area: 'Visual',
    message: 'Started converting the empty Visual section into an Ops Map with moving agent state.',
    source: 'telegram:633',
  },
  {
    time: '11:13',
    actor: 'Guillermo',
    level: 'INFO',
    area: 'Product Direction',
    message: 'Defined Visual as small task panels on a wall with 8-bit agents moving toward active work.',
    source: 'telegram:633',
  },
  {
    time: '11:05',
    actor: 'SkyNode',
    level: 'DONE',
    area: 'Navigation',
    message: 'Recommended keeping Overview, Logs and Settings while folding Agents into Team.',
    source: 'telegram:629',
  },
  {
    time: '03:11',
    actor: 'Mission Control',
    level: 'DONE',
    area: 'Sidebar',
    message: 'Marked empty sections with 0 so unfinished modules are visible without pretending to be complete.',
    source: 'commit:032e05f',
  },
  {
    time: '02:56',
    actor: 'SkyNode',
    level: 'DONE',
    area: 'Team',
    message: 'Created Team as the orchestration layer for humans, agents, workflows and responsibilities.',
    source: 'commit:2fd9dfe',
  },
  {
    time: '02:51',
    actor: 'SkyNode',
    level: 'DONE',
    area: 'Docs',
    message: 'Created Docs as an AI-native knowledge dashboard over local markdown, project docs and memory.',
    source: 'commit:cf5ec98',
  },
];

const levelStyles: Record<LogLevel, string> = {
  INFO: 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100',
  ACTION: 'border-violet-300/40 bg-violet-300/10 text-violet-100',
  WARN: 'border-rose-300/40 bg-rose-300/10 text-rose-100',
  DONE: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
};

function Pill({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

export default function LogsPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Logs</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Operational Audit Trail</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Timeline of agent actions, product decisions, deployments, builds and system events across Mission Control.
        </p>
      </section>

      <section className="grid gap-5 px-6 py-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-md border border-cyan-300/15 bg-slate-950/65 p-4">
          <h2 className="text-sm font-semibold text-white">Runtime Channels</h2>
          <div className="mt-4 space-y-3">
            {['Telegram Direct', 'Mission Control UI', 'Git Commits', 'Build Gate', 'Cloudflare Tunnel'].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2">
                <span className="text-xs text-slate-300">{item}</span>
                <span className="mono text-[10px] text-cyan-100">{index === 4 ? 'WATCH' : 'LIVE'}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="rounded-md border border-cyan-300/15 bg-slate-950/65">
          <div className="grid grid-cols-[0.55fr_0.8fr_0.72fr_1fr] gap-3 border-b border-cyan-300/10 px-4 py-3 mono text-[10px] uppercase tracking-[0.14em] text-slate-500 md:grid-cols-[0.45fr_0.72fr_0.58fr_0.7fr_2fr_0.9fr]">
            <span>Time</span>
            <span>Actor</span>
            <span>Level</span>
            <span className="hidden md:block">Area</span>
            <span>Message</span>
            <span className="hidden md:block">Source</span>
          </div>
          <div className="divide-y divide-cyan-300/10">
            {LOGS.map((entry) => (
              <article key={`${entry.time}-${entry.message}`} className="grid grid-cols-[0.55fr_0.8fr_0.72fr_1fr] gap-3 px-4 py-3 md:grid-cols-[0.45fr_0.72fr_0.58fr_0.7fr_2fr_0.9fr]">
                <span className="mono text-[11px] text-cyan-200/80">{entry.time}</span>
                <span className="text-xs font-semibold text-slate-200">{entry.actor}</span>
                <Pill className={levelStyles[entry.level]}>{entry.level}</Pill>
                <span className="hidden text-xs text-slate-400 md:block">{entry.area}</span>
                <span className="text-xs leading-5 text-slate-300">{entry.message}</span>
                <span className="hidden truncate mono text-[10px] text-slate-500 md:block">{entry.source}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
