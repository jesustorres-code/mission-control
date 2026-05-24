import PixelOctopus from '../components/PixelOctopus';

type Agent = { name: string; status: 'online' | 'idle' | 'offline'; tasks: number; load: number };

const AGENTS: Agent[] = [
  { name: 'Vega',       status: 'online',  tasks: 7, load: 62 },
  { name: 'Polaris',    status: 'idle',    tasks: 2, load: 18 },
  { name: 'Orion',      status: 'online',  tasks: 4, load: 41 },
  { name: 'Cassiopeia', status: 'offline', tasks: 0, load: 0  },
];

const STATS = [
  { label: 'Active agents',   value: '03',     hint: '+1 today' },
  { label: 'Tasks in flight', value: '13',     hint: '4 queued' },
  { label: 'Avg latency',     value: '184',    hint: 'ms · p50' },
  { label: 'Uptime',          value: '99.97%', hint: '30d'      },
];

function StatusDot({ s }: { s: Agent['status'] }) {
  const color =
    s === 'online'  ? '#16a34a' :
    s === 'idle'    ? '#f59e0b' : '#9ca3af';
  return (
    <span
      aria-label={s}
      className={`inline-block w-2 h-2 ${s === 'online' ? 'blink' : ''}`}
      style={{ backgroundColor: color, imageRendering: 'pixelated' }}
    />
  );
}

function PixelBar({ pct }: { pct: number }) {
  const cells = 16;
  const filled = Math.round((pct / 100) * cells);
  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: cells }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-2.5"
          style={{
            backgroundColor:
              i < filled
                ? i < cells * 0.66 ? 'var(--primary)' : 'var(--accent)'
                : 'var(--border)',
          }}
        />
      ))}
      <span className="ml-2 text-[11px] mono text-[color:var(--muted)]">
        {String(pct).padStart(2, '0')}%
      </span>
    </div>
  );
}

export default function Overview() {
  return (
    <div>
      <header className="border-b border-[color:var(--border)] bg-white">
        <div className="px-8 py-5 pixel-grid">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight">Overview</h1>
              <p className="text-[12px] mono text-[color:var(--muted)] mt-0.5">
                MISSION_CONTROL · ALL_SYSTEMS_NOMINAL
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 text-[12px] font-medium rounded-md border border-[color:var(--border)] hover:bg-[color:var(--surface)]">
                Refresh
              </button>
              <button className="px-3 py-1.5 text-[12px] font-medium rounded-md bg-[color:var(--primary)] text-white hover:bg-[color:var(--accent)]">
                New mission
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-6 max-w-[1200px]">
        <section className="grid grid-cols-4 gap-3 mb-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="border border-[color:var(--border)] rounded-md bg-white p-4 hover:border-[color:var(--accent)] transition-colors"
            >
              <div className="text-[10px] mono uppercase tracking-wider text-[color:var(--muted)]">
                {s.label}
              </div>
              <div className="mt-1 text-2xl mono font-semibold text-[color:var(--foreground)]">
                {s.value}
              </div>
              <div className="text-[11px] mono text-[color:var(--muted)] mt-1">{s.hint}</div>
            </div>
          ))}
        </section>

        <section className="border border-[color:var(--border)] rounded-md bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[color:var(--border)] flex items-center justify-between pixel-grid">
            <div className="flex items-center gap-2">
              <PixelOctopus size={14} color="var(--primary)" />
              <h2 className="text-[13px] font-semibold">Agents</h2>
            </div>
            <span className="text-[10px] mono text-[color:var(--muted)]">{AGENTS.length} TOTAL</span>
          </div>

          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[10px] mono uppercase tracking-wider text-[color:var(--muted)] bg-[color:var(--surface)]">
                <th className="px-4 py-2 font-medium">Agent</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Tasks</th>
                <th className="px-4 py-2 font-medium">Load</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a) => (
                <tr key={a.name} className="border-t border-[color:var(--border)] hover:bg-[color:var(--surface)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <PixelOctopus size={18} color="var(--primary)" />
                      <span className="font-medium">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusDot s={a.status} />
                      <span className="text-[12px] mono text-[color:var(--muted)] uppercase">
                        {a.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 mono">{a.tasks}</td>
                  <td className="px-4 py-3"><PixelBar pct={a.load} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
