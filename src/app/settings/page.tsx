type SettingGroup = {
  title: string;
  status: string;
  items: string[];
};

const GROUPS: SettingGroup[] = [
  {
    title: 'Telegram + Voice',
    status: 'Configured',
    items: ['Text response first', 'Voice note delivery', 'es-MX-JorgeNeural', '1.8x playback preference'],
  },
  {
    title: 'AI Runtime',
    status: 'Planned',
    items: ['Model selection', 'agent tool scopes', 'memory injection rules', 'workflow permissions'],
  },
  {
    title: 'Workspace',
    status: 'Configured',
    items: ['projects/ as permanent workspace', 'media-out/ as temporary output', 'memory files as continuity layer'],
  },
  {
    title: 'Integrations',
    status: 'Planned',
    items: ['GitHub', 'OpenClaw Gateway', 'Cloudflare tunnel', 'future vector database'],
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Control Surface</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Configuration map for communication, runtime, workspace paths and integrations. Editing controls come after persistence is wired.
        </p>
      </section>

      <section className="grid gap-4 px-6 py-5 xl:grid-cols-2">
        {GROUPS.map((group) => (
          <article key={group.title} className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4 shadow-[0_0_26px_rgba(14,165,233,0.07)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <p className="mt-1 mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{group.status}</p>
              </div>
              <span className="rounded border border-cyan-300/35 bg-cyan-300/10 px-2 py-1 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100">
                {group.status}
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {group.items.map((item) => (
                <div key={item} className="rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-xs text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
