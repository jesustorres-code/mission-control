'use client';

import { useMemo, useState } from 'react';

type WatchTab = 'Topic Watchlist' | 'Content Ideas';
type Trend = 'Rising Fast' | 'Rising' | 'Stable' | 'Declining';

type Topic = {
  name: string;
  source: string;
  score: number;
  growth: string;
  intensity: string;
  momentum: Trend;
  tracked: string;
  summary: string;
  opportunity: string;
  tags: string[];
  trend: number[];
};

type Idea = {
  title: string;
  format: string;
  owner: string;
  whyNow: string;
  sourceSignals: string[];
  score: number;
};

const TOPICS: Topic[] = [
  {
    name: 'Mission Control as an AI operations cockpit',
    source: 'GitHub repo + Telegram build loop + active deployment',
    score: 86,
    growth: '+38%',
    intensity: 'High',
    momentum: 'Rising Fast',
    tracked: 'tracked 2d',
    summary:
      'The strongest current signal is the Mission Control product itself: task orchestration, agent ownership, realtime filters, and operator workflows are recurring across the active repo and chat direction.',
    opportunity:
      'Create a technical build log showing how an AI-native dashboard evolves from Tasks into Content intelligence and agent operations.',
    tags: ['mission-control', 'ai-agents', 'ops-dashboard', 'nextjs'],
    trend: [34, 42, 48, 59, 67, 78, 86],
  },
  {
    name: 'Telegram-first AI operator workflows',
    source: 'OpenClaw conversations + voice reply preference + service admin tasks',
    score: 78,
    growth: '+24%',
    intensity: 'High',
    momentum: 'Rising',
    tracked: 'tracked 1w',
    summary:
      'Your workflow is increasingly centered on Telegram as the command surface for deployment, monitoring, memory, commits, and voice confirmations.',
    opportunity:
      'Publish a concise walkthrough: controlling cloud services and AI projects from Telegram with text plus voice feedback.',
    tags: ['telegram', 'openclaw', 'voice-ops', 'automation'],
    trend: [41, 45, 52, 56, 61, 70, 78],
  },
  {
    name: 'AI task ownership between humans and agents',
    source: 'Tasks module + Inky/Tina ownership model + member filters',
    score: 72,
    growth: '+19%',
    intensity: 'Medium High',
    momentum: 'Rising',
    tracked: 'tracked 3d',
    summary:
      'The newest UI work formalizes task ownership across Inky, Tina, AI agents, and team queues. This is becoming a reusable product concept.',
    opportunity:
      'Turn the owner filter and Task Registry into a short product essay about human-agent accountability.',
    tags: ['task-ownership', 'inky', 'tina', 'workflow'],
    trend: [28, 34, 44, 51, 59, 66, 72],
  },
  {
    name: 'Shazam popular segment analysis',
    source: 'projects/shazam-popular-segments + public Apache route',
    score: 58,
    growth: '+11%',
    intensity: 'Medium',
    momentum: 'Stable',
    tracked: 'tracked 2w',
    summary:
      'The audio analysis project remains a useful technical pillar: extracting popular music segments, preview providers, and usable browser tooling.',
    opportunity:
      'Package it as a demo story about turning music discovery into measurable content hooks.',
    tags: ['audio-intelligence', 'shazam', 'music-tech', 'clips'],
    trend: [45, 49, 54, 56, 57, 58, 58],
  },
  {
    name: 'TerraView civic signal dashboards',
    source: 'RPD-12 TerraView prototype + Oaxaca map asset + Cloudflare demo history',
    score: 46,
    growth: '+6%',
    intensity: 'Moderate',
    momentum: 'Stable',
    tracked: 'tracked 5d',
    summary:
      'TerraView is still strategically useful as a second proof point for dashboards, maps, regional intelligence, and simulated alert centers.',
    opportunity:
      'Reuse the visual language for a civic intelligence case study after Mission Control stabilizes.',
    tags: ['terraview', 'civic-intel', 'maps', 'oaxaca'],
    trend: [39, 41, 42, 43, 45, 45, 46],
  },
  {
    name: 'LinkedIn profile and opportunity research',
    source: 'authorized account research context + profile analysis request history',
    score: 34,
    growth: '-3%',
    intensity: 'Low Medium',
    momentum: 'Declining',
    tracked: 'tracked 1d',
    summary:
      'This remains a lower-confidence signal until the research workflow is resumed with a defined objective, target audience, and safe source plan.',
    opportunity:
      'Hold until there is a concrete search goal or a profile optimization task.',
    tags: ['linkedin', 'research', 'profile', 'opportunities'],
    trend: [47, 44, 42, 39, 37, 35, 34],
  },
];

const IDEAS: Idea[] = [
  {
    title: 'Build log: from Telegram prompt to deployed AI Mission Control',
    format: 'Thread + short video script',
    owner: 'Inky',
    whyNow:
      'The project has visible momentum: cloned repo, deployed tunnel, Tasks module, filters, member ownership, and a new Content intelligence layer.',
    sourceSignals: ['Mission Control repo', 'Telegram commands', 'Cloudflare deployment'],
    score: 91,
  },
  {
    title: 'Human vs AI task ownership: why every agent dashboard needs accountability',
    format: 'LinkedIn post',
    owner: 'Tina',
    whyNow:
      'The Inky/Tina/Team filter creates a clear product narrative around delegation boundaries and responsible automation.',
    sourceSignals: ['Task Registry', 'Owner selector', 'Blocked credential scope'],
    score: 82,
  },
  {
    title: 'How I run services from chat: text, voice, commits, deploy checks',
    format: 'Technical blog outline',
    owner: 'Inky',
    whyNow:
      'Your operating pattern is distinctive: Telegram as the command layer, voice replies, git commits, service restarts, and public URLs.',
    sourceSignals: ['OpenClaw workflow', 'voice notes', 'systemd user services'],
    score: 77,
  },
  {
    title: 'AI trend radar for personal projects, not generic internet noise',
    format: 'Product demo page',
    owner: 'Ops Team',
    whyNow:
      'The Watchlist module can position Mission Control as a personal intelligence system grounded in repos, chats, memory, and agents.',
    sourceSignals: ['Watchlist module', 'workspace memory', 'connected projects'],
    score: 74,
  },
];

const TABS: WatchTab[] = ['Topic Watchlist', 'Content Ideas'];

function AntennaIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-violet-300/30 bg-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.22)]">
      <span className="absolute left-5 top-2 h-6 w-0.5 rotate-[-24deg] bg-cyan-300" />
      <span className="absolute left-3 top-3 h-2 w-2 rounded-full border border-cyan-200" />
      <span className="absolute bottom-2 left-4 h-1.5 w-4 rounded-full bg-violet-300" />
      <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-300 blink" />
    </div>
  );
}

function urgency(score: number) {
  if (score >= 70) return { label: 'MAKE NOW', className: 'border-rose-300/50 bg-rose-500/15 text-rose-100' };
  if (score >= 50) return { label: 'WATCH CLOSELY', className: 'border-amber-300/50 bg-amber-400/15 text-amber-100' };
  if (score >= 30) return { label: 'MONITOR', className: 'border-slate-300/40 bg-slate-400/10 text-slate-200' };
  return { label: 'LOW SIGNAL', className: 'border-slate-600/60 bg-slate-900 text-slate-500' };
}

function SignalPill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

function TrendChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="w-2 rounded-t bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
          style={{ height: `${Math.max(18, (value / max) * 100)}%`, opacity: 0.45 + index * 0.07 }}
        />
      ))}
    </div>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  const flag = urgency(topic.score);

  return (
    <article className="rounded-md border border-violet-300/15 bg-slate-950/72 p-4 shadow-[0_0_28px_rgba(88,28,135,0.14)] transition hover:border-violet-300/45">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SignalPill className={flag.className}>{flag.label}</SignalPill>
          <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white">{topic.name}</h3>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.12em] text-violet-200/60">{topic.source}</p>
        </div>
        <div className="text-right">
          <p className="mono text-3xl font-semibold text-cyan-100">{topic.score}</p>
          <p className="mono text-[10px] uppercase tracking-[0.12em] text-slate-500">score</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{topic.summary}</p>
      <p className="mt-3 rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-[12px] leading-relaxed text-cyan-100/80">
        {topic.opportunity}
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_120px]">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded border border-slate-700/70 bg-slate-900/70 p-2">
            <p className="mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Growth</p>
            <p className="mono mt-1 text-[12px] text-cyan-100">{topic.growth}</p>
          </div>
          <div className="rounded border border-slate-700/70 bg-slate-900/70 p-2">
            <p className="mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Intensity</p>
            <p className="mono mt-1 text-[12px] text-cyan-100">{topic.intensity}</p>
          </div>
          <div className="rounded border border-slate-700/70 bg-slate-900/70 p-2">
            <p className="mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Tracked</p>
            <p className="mono mt-1 text-[12px] text-cyan-100">{topic.tracked}</p>
          </div>
        </div>
        <TrendChart values={topic.trend} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <SignalPill className="border-violet-300/40 bg-violet-400/10 text-violet-100">{topic.momentum}</SignalPill>
        {topic.tags.map((tag) => (
          <span key={tag} className="rounded border border-slate-600/50 px-2 py-1 text-[10px] text-slate-300">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function IdeaCard({ idea }: { idea: Idea }) {
  const flag = urgency(idea.score);

  return (
    <article className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SignalPill className={flag.className}>{flag.label}</SignalPill>
          <h3 className="mt-3 text-[15px] font-semibold text-white">{idea.title}</h3>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{idea.format} - {idea.owner}</p>
        </div>
        <p className="mono text-2xl font-semibold text-cyan-100">{idea.score}</p>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{idea.whyNow}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {idea.sourceSignals.map((signal) => (
          <span key={signal} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
            {signal}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ContentWatchlist() {
  const [activeTab, setActiveTab] = useState<WatchTab>('Topic Watchlist');
  const sortedTopics = useMemo(() => [...TOPICS].sort((a, b) => b.score - a.score), []);
  const topScore = sortedTopics[0]?.score ?? 0;

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-violet-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AntennaIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-violet-200/75">CONTENT_INTEL · SIGNALS_SYNC_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Watchlist</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Last auto-sync: 02:19 CST - workspace, repos, agents, memory</p>
              </div>
            </div>
            <button className="rounded-md bg-violet-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:bg-violet-200">
              + Add Topic
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
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

          {activeTab === 'Topic Watchlist' ? (
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[14px] font-semibold text-white">Tracking topics - sorted by score</h2>
                  <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Relevance, opportunity, growth, recurrence, and strategic fit</p>
                </div>
                <SignalPill className="border-rose-300/50 bg-rose-500/15 text-rose-100">{topScore}+ top signal</SignalPill>
              </div>
              <div className="grid gap-3 2xl:grid-cols-2">
                {sortedTopics.map((topic) => (
                  <TopicCard key={topic.name} topic={topic} />
                ))}
              </div>
            </section>
          ) : (
            <section className="space-y-3">
              <div>
                <h2 className="text-[14px] font-semibold text-white">AI-generated content opportunities</h2>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Generated from projects, tasks, agents, deployment events, and working memory</p>
              </div>
              <div className="grid gap-3 2xl:grid-cols-2">
                {IDEAS.map((idea) => (
                  <IdeaCard key={idea.title} idea={idea} />
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Priority Ladder</h2>
            <div className="mt-4 space-y-2">
              <SignalPill className="border-rose-300/50 bg-rose-500/15 text-rose-100">70+ MAKE NOW</SignalPill>
              <SignalPill className="border-amber-300/50 bg-amber-400/15 text-amber-100">50-69 WATCH CLOSELY</SignalPill>
              <SignalPill className="border-slate-300/40 bg-slate-400/10 text-slate-200">30-49 MONITOR</SignalPill>
              <SignalPill className="border-slate-600/60 bg-slate-900 text-slate-500">&lt;30 LOW SIGNAL</SignalPill>
            </div>
          </section>

          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Connected Signal Sources</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-violet-100/80">
              {['Telegram build loop', 'GitHub repos', 'Workspace memory', 'OpenClaw agents', 'Public deployments', 'Project docs'].map((source) => (
                <div key={source} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>{source}</span>
                  <span className="text-cyan-100">active</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Strategy Answer</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
              Create content now around Mission Control as an AI operations cockpit. It has the strongest blend of recency, build proof, product narrative, and reusable audience value.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

