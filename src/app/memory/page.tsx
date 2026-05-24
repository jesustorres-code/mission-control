'use client';

import { useMemo, useState } from 'react';

type MemoryTab = 'Daily Log' | 'Long-term';
type DailyLogEntry = {
  time: string;
  title: string;
  body: string;
  detail: string;
  source: string;
  memoryType: string;
  links: string[];
  actions: string[];
};
type MemoryLayer = {
  name: string;
  description: string;
  status: string;
  linked: string[];
};

const DAILY_LOG: DailyLogEntry[] = [
  {
    time: '02:37',
    title: 'Projects operating dashboard created',
    body: 'Added /projects with real initiatives: Mission Control, Shazam Popular Segments, RPD-12 TerraView, Content Intelligence Watchlist, OpenClaw Ops Workspace, and gytmdl tooling.',
    detail:
      'Projects became the operating map for Guillermo’s active ecosystem. It links product work, infrastructure, demos, AI pipelines, repos, agents, and deployment state into one executive layer.',
    source: 'memory/2026-05-24.md + commit 891c042',
    memoryType: 'episodic / project intelligence',
    links: ['Projects', 'Mission Control', 'git commit 891c042'],
    actions: ['Open /projects', 'Link project tasks', 'Review pipelines', 'Summarize progress'],
  },
  {
    time: '02:31',
    title: 'Scheduler automation tower created',
    body: 'Added /calendar as an AI automation control center with daily, recurring, and one-shot workflows using SkyNode, Inky, Ops Team, and Watchlist Engine.',
    detail:
      'Scheduler models temporal automation as runnable workflows instead of calendar blocks. It captures cron logic, recurrence, agents, channels, next-run indicators, and operational actions.',
    source: 'memory/2026-05-24.md + commit 6ed2214',
    memoryType: 'episodic / procedural',
    links: ['Calendar', 'Scheduler', 'git commit 6ed2214'],
    actions: ['Open /calendar', 'Inspect workflows', 'Run manually', 'Review logs'],
  },
  {
    time: '02:19',
    title: 'Content Watchlist launched',
    body: 'Added /content with Topic Watchlist, Content Ideas, scoring, urgency tiers, semantic tags, connected sources, and single-column signal cards.',
    detail:
      'Watchlist is the content intelligence layer. It ranks signals from Guillermo’s own projects, conversations, repos, deployments, memory, and agent work instead of using generic example topics.',
    source: 'memory/2026-05-24.md + commits 62c7cc6 / 4806b62',
    memoryType: 'episodic / semantic',
    links: ['Content', 'Watchlist', 'git commits 62c7cc6 / 4806b62'],
    actions: ['Open /content', 'Generate ideas', 'Re-score signals', 'Link to tasks'],
  },
  {
    time: '01:45',
    title: 'Mission Control deployed',
    body: 'Cloned jesustorres-code/mission-control, installed dependencies, fixed Turbopack root, built production app, and served it through systemd plus Cloudflare Tunnel.',
    detail:
      'This is the root deployment event for the current Mission Control workstream. The app runs locally on Next.js through a systemd user service and is exposed through a Cloudflare quick tunnel.',
    source: 'memory/2026-05-24.md + deployment checks',
    memoryType: 'episodic / infrastructure',
    links: ['Next.js', 'Cloudflare Tunnel', 'systemd'],
    actions: ['Check public URL', 'Restart service', 'Review git state', 'Audit dependencies'],
  },
];

const LONG_TERM_MARKDOWN = `# Long-Term Memory

- Guillermo is the primary user. Address him as Guillermo.
- SkyNode identity: AI assistant connected to OpenCloud with a calm, technical, efficient, slightly futuristic voice.
- Core mission: help Guillermo from Telegram with services, automation, monitoring, and technical projects.
- Telegram replies should include text plus a voice note by default.
- Preferred voice workflow: edge-tts, es-MX-JorgeNeural, +80% speed, calm and grounded.
- Permanent project workspace: /home/ubuntu/.openclaw/workspace/projects.
- Active flagship project: Mission Control, deployed through Next.js and Cloudflare Tunnel.
- Current operating style: Telegram-first commands, visible URL checks, lint/build verification, local commits, and concise status reporting.`;

const LAYERS: MemoryLayer[] = [
  {
    name: 'Layer 1 - Daily Logs',
    description: 'Operational journal of sessions, project changes, commits, deployments, decisions, and agent activity.',
    status: 'active',
    linked: ['memory/2026-05-24.md', 'session events', 'commit trail'],
  },
  {
    name: 'Layer 2 - Long-Term Memory',
    description: 'Curated identity, preferences, purpose, communication defaults, workspace rules, and durable context.',
    status: 'active',
    linked: ['MEMORY.md', 'USER.md', 'TOOLS.md'],
  },
  {
    name: 'Layer 3 - Semantic Index',
    description: 'Recall layer for retrieving related memories before answering questions about people, preferences, projects, decisions, and todos.',
    status: 'ready',
    linked: ['semantic search', 'context recall', 'memory citations'],
  },
  {
    name: 'Layer 4 - Agent Injection',
    description: 'Selected context sent into active workflows so agents keep continuity without exposing unrelated private data.',
    status: 'guarded',
    linked: ['SkyNode', 'Inky', 'Watchlist Engine'],
  },
  {
    name: 'Layer 5 - Memory Compression',
    description: 'Daily logs can be distilled into long-term memory when a fact becomes durable, strategic, or preference-level.',
    status: 'scheduled',
    linked: ['heartbeat review', 'daily consolidation', 'long-term curation'],
  },
];

const RECALLS = [
  ['Identity', 'SkyNode helps Guillermo from Telegram with OpenCloud operations and technical projects.'],
  ['Preference', 'Text plus voice note by default; audio is important but should stay paired with concise text.'],
  ['Projects', 'Mission Control is the flagship dashboard; Shazam and TerraView remain reusable product demos.'],
  ['Operations', 'Use lint/build, URL checks, systemd status, and commits before reporting completion.'],
];

function BrainIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-violet-300/30 bg-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.24)]">
      <span className="absolute left-2 top-3 h-4 w-4 rounded-full border border-violet-300 bg-violet-300/10" />
      <span className="absolute right-2 top-3 h-4 w-4 rounded-full border border-cyan-300 bg-cyan-300/10" />
      <span className="absolute left-3 top-5 h-4 w-5 rounded-b-full border-b border-l border-r border-violet-200/70" />
      <span className="absolute right-3 top-5 h-4 w-5 rounded-b-full border-b border-l border-r border-cyan-200/70" />
      <span className="absolute left-5 top-2 h-7 w-px bg-slate-500" />
      <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-cyan-300 blink" />
    </div>
  );
}

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

function MarkdownPanel({
  tab,
  selectedEntry,
  onSelectEntry,
}: {
  tab: MemoryTab;
  selectedEntry: DailyLogEntry;
  onSelectEntry: (entry: DailyLogEntry) => void;
}) {
  if (tab === 'Long-term') {
    return (
      <section className="rounded-md border border-violet-300/15 bg-slate-950/72 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-300/15 pb-3">
          <div>
            <h2 className="text-[14px] font-semibold text-white">Long-term Memory</h2>
            <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Persistent identity, preferences, mission, and operating context</p>
          </div>
          <Pill className="border-violet-300/40 bg-violet-400/10 text-violet-100">MEMORY.md</Pill>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded border border-slate-700/70 bg-slate-900/80 p-4 mono text-[12px] leading-relaxed text-slate-200">
          {LONG_TERM_MARKDOWN}
        </pre>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/15 pb-3">
        <div>
          <h2 className="text-[14px] font-semibold text-white">Daily Log</h2>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">2026-05-24 operational journal</p>
        </div>
        <Pill className="border-cyan-300/40 bg-cyan-400/10 text-cyan-100">memory/2026-05-24.md</Pill>
      </div>
      <div className="mt-4 space-y-3">
        {DAILY_LOG.map((entry) => (
          <button
            key={entry.title}
            type="button"
            onClick={() => onSelectEntry(entry)}
            className={[
              'block w-full rounded border p-3 text-left transition',
              selectedEntry.title === entry.title
                ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.16)]'
                : 'border-slate-700/70 bg-slate-900/70 hover:border-cyan-300/35 hover:bg-cyan-300/5',
            ].join(' ')}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">{entry.time} CST</p>
                <h3 className="mt-1 text-[13px] font-semibold text-white">{entry.title}</h3>
              </div>
              <Pill className="border-cyan-300/30 bg-cyan-300/8 text-cyan-100">episodic</Pill>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">{entry.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.links.map((link) => (
                <span key={link} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
                  {link}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DailyLogDetail({ entry }: { entry: DailyLogEntry }) {
  return (
    <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">{entry.time} CST selected memory</p>
          <h2 className="mt-2 text-[15px] font-semibold leading-snug text-white">{entry.title}</h2>
        </div>
        <Pill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{entry.memoryType}</Pill>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{entry.detail}</p>

      <div className="mt-4 rounded border border-slate-700/70 bg-slate-900/70 p-3">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Source</p>
        <p className="mt-2 text-[12px] leading-relaxed text-cyan-100">{entry.source}</p>
      </div>

      <div className="mt-4">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Linked Context</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.links.map((link) => (
            <span key={link} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
              {link}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Available Actions</p>
        <div className="mt-2 grid gap-2">
          {entry.actions.map((action) => (
            <button
              key={action}
              type="button"
              className="rounded border border-cyan-300/20 bg-cyan-300/8 px-2.5 py-2 text-left text-[11px] font-semibold text-cyan-50 hover:bg-cyan-300/15"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function MemoryDashboard() {
  const [activeTab, setActiveTab] = useState<MemoryTab>('Daily Log');
  const [selectedEntry, setSelectedEntry] = useState<DailyLogEntry>(DAILY_LOG[0]);
  const activeLayerCount = useMemo(() => LAYERS.filter((layer) => ['active', 'ready'].includes(layer.status)).length, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-violet-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrainIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-violet-200/75">MEMORY_CORE - CONTEXT_ENGINE_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Memory</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Daily logs, long-term identity, semantic recall, and agent continuity</p>
              </div>
            </div>
            <button className="rounded-md bg-violet-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:bg-violet-200">
              Sync Memory
            </button>
          </div>
        </div>
      </header>

      <div
        className={[
          'grid gap-5 px-8 py-6',
          activeTab === 'Daily Log' ? 'xl:grid-cols-[minmax(0,1fr)_340px]' : 'xl:grid-cols-1',
        ].join(' ')}
      >
        <main className="min-w-0 space-y-5">
          {activeTab === 'Daily Log' && (
            <section className="grid gap-3 md:grid-cols-4">
              {[
                ['Memory layers', String(LAYERS.length).padStart(2, '0'), 'daily / long-term / semantic'],
                ['Active recall', String(activeLayerCount).padStart(2, '0'), 'safe context channels'],
                ['Daily entries', String(DAILY_LOG.length).padStart(2, '0'), 'today'],
                ['Linked modules', '05', 'tasks / content / calendar / projects / docs'],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-4">
                  <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">{label}</p>
                  <p className="mt-2 mono text-3xl font-semibold text-white">{value}</p>
                  <p className="mt-1 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{hint}</p>
                </div>
              ))}
            </section>
          )}

          <section className="rounded-md border border-violet-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap gap-2">
              {(['Daily Log', 'Long-term'] as MemoryTab[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={[
                      'rounded-md border px-3 py-2 text-[12px] font-semibold transition',
                      isActive
                        ? 'border-violet-300/70 bg-violet-300/15 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-violet-300/35 hover:bg-violet-300/8',
                    ].join(' ')}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </section>

          <MarkdownPanel tab={activeTab} selectedEntry={selectedEntry} onSelectEntry={setSelectedEntry} />

          {activeTab === 'Daily Log' && (
            <section className="grid gap-3 lg:grid-cols-2">
              {LAYERS.map((layer) => (
                <article key={layer.name} className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-[13px] font-semibold text-white">{layer.name}</h3>
                    <Pill className="border-cyan-300/40 bg-cyan-300/10 text-cyan-100">{layer.status}</Pill>
                  </div>
                  <p className="mt-3 text-[12px] leading-relaxed text-slate-300">{layer.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {layer.linked.map((item) => (
                      <span key={item} className="rounded border border-slate-600/50 px-2 py-1 text-[10px] text-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>

        {activeTab === 'Daily Log' && (
          <aside className="space-y-5">
            <DailyLogDetail entry={selectedEntry} />

            <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
              <h2 className="text-[13px] font-semibold text-white">Semantic Recall</h2>
              <div className="mt-4 space-y-3">
                {RECALLS.map(([label, text]) => (
                  <div key={label} className="rounded border border-slate-700/70 bg-slate-900/70 p-3">
                    <p className="mono text-[10px] uppercase tracking-[0.14em] text-violet-200/70">{label}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
              <h2 className="text-[13px] font-semibold text-white">Knowledge Links</h2>
              <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
                {['Tasks', 'Content', 'Calendar', 'Projects', 'Docs', 'Agents'].map((item) => (
                  <div key={item} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                    <span>{item}</span>
                    <span className="text-violet-100">linked</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-violet-300/15 bg-violet-300/8 p-4">
              <h2 className="text-[13px] font-semibold text-white">Memory Guardrail</h2>
              <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
                This view exposes curated operational context, not secrets. Sensitive credentials, cookies, and private raw data stay out of the dashboard.
              </p>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}
