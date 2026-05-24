'use client';

import { useMemo, useState } from 'react';

type Status = 'ACTIVE' | 'DEPLOYING' | 'PLANNING' | 'REVIEW' | 'PAUSED';
type Category = 'AI System' | 'Product' | 'Content Pipeline' | 'Infrastructure' | 'Research';

type Project = {
  name: string;
  status: Status;
  category: Category;
  progress: number;
  created: string;
  repo: string;
  route: string;
  summary: string;
  agents: string[];
  pipelines: string[];
  metrics: Array<[string, string]>;
  activity: string;
};

const PROJECTS: Project[] = [
  {
    name: 'Mission Control',
    status: 'DEPLOYING',
    category: 'AI System',
    progress: 78,
    created: '2026-05-24',
    repo: 'github.com/jesustorres-code/mission-control',
    route: '/home/ubuntu/.openclaw/workspace/projects/mission-control',
    summary:
      'AI-native operations dashboard for Tasks, Content Watchlist, Scheduler, and project intelligence. Currently running through Next.js, systemd user services, and Cloudflare Tunnel.',
    agents: ['SkyNode', 'Inky', 'Ops Team', 'Watchlist Engine'],
    pipelines: ['task registry', 'content scoring', 'scheduler runtime', 'public deploy'],
    metrics: [['commits ahead', '4'], ['routes live', '3'], ['status', '200']],
    activity: 'Latest modules: Tasks, Content, Calendar. Public tunnel is active.',
  },
  {
    name: 'Shazam Popular Segments',
    status: 'ACTIVE',
    category: 'Product',
    progress: 84,
    created: '2026-05-17',
    repo: 'local git project',
    route: '/home/ubuntu/.openclaw/workspace/projects/shazam-popular-segments',
    summary:
      'Audio intelligence system for creating song cases, extracting popular clips, testing providers, and serving a browser interface through Apache.',
    agents: ['SkyNode', 'Ops Team'],
    pipelines: ['clip extraction', 'provider previews', 'case generation', 'Apache route'],
    metrics: [['public route', '/shazam'], ['api port', '8000'], ['health', 'online']],
    activity: 'Service is running locally behind Apache on the public /shazam route.',
  },
  {
    name: 'RPD-12 TerraView',
    status: 'REVIEW',
    category: 'Research',
    progress: 63,
    created: '2026-05-21',
    repo: 'static workspace prototype',
    route: '/home/ubuntu/.openclaw/workspace/projects/rpd-12-terraview',
    summary:
      'Civic intelligence prototype for territorial dashboards, Oaxaca map visualization, sentiment/risk overlays, alert center, narratives, and exportable data.',
    agents: ['SkyNode', 'Watchlist Engine'],
    pipelines: ['map visualization', 'risk scoring', 'narrative analysis', 'CSV export'],
    metrics: [['tunnel history', 'active recently'], ['map asset', 'ready'], ['mode', 'demo']],
    activity: 'Prototype has assets and a Cloudflare demo history; ready for product hardening.',
  },
  {
    name: 'Content Intelligence Watchlist',
    status: 'ACTIVE',
    category: 'Content Pipeline',
    progress: 71,
    created: '2026-05-24',
    repo: 'mission-control/src/app/content',
    route: '/content',
    summary:
      'Trend intelligence layer that ranks topics from Guillermo’s real ecosystem: repos, Telegram build loops, memory, OpenClaw agents, deployments, and project docs.',
    agents: ['Watchlist Engine', 'Inky'],
    pipelines: ['source ingest', 'semantic ranking', 'summarization', 'content ideas'],
    metrics: [['top score', '86'], ['ideas', '4'], ['layout', 'list']],
    activity: 'Now displayed as single-column horizontal cards with Topic Watchlist and Content Ideas.',
  },
  {
    name: 'OpenClaw Ops Workspace',
    status: 'ACTIVE',
    category: 'Infrastructure',
    progress: 69,
    created: '2026-05-16',
    repo: '/home/ubuntu/.openclaw/workspace',
    route: '/home/ubuntu/.openclaw/workspace',
    summary:
      'Operational home for memory, voice replies, Telegram workflows, dashboard reverse proxy notes, temporary media, project context, and agent continuity.',
    agents: ['SkyNode'],
    pipelines: ['memory capture', 'voice reply', 'service notes', 'heartbeat readiness'],
    metrics: [['voice', 'enabled'], ['timezone', 'CST'], ['dashboard', 'proxied']],
    activity: 'Maintains Guillermo’s preferences, TTS setup, project locations, and service URLs.',
  },
  {
    name: 'gytmdl / YouTube Music Tooling',
    status: 'PLANNING',
    category: 'Product',
    progress: 42,
    created: '2026-05-19',
    repo: 'local git project',
    route: '/home/ubuntu/.openclaw/workspace/projects/gytmdl',
    summary:
      'Local tooling workspace related to YouTube Music flows. Useful as a future integration point for audio/content pipelines and media automation.',
    agents: ['SkyNode', 'Ops Team'],
    pipelines: ['media retrieval', 'metadata handling', 'content pipeline input'],
    metrics: [['repo', 'local'], ['phase', 'planning'], ['integration', 'future']],
    activity: 'Tracked as a future pipeline dependency rather than an active deployed service.',
  },
];

const STATUSES: Array<'ALL' | Status> = ['ALL', 'ACTIVE', 'DEPLOYING', 'PLANNING', 'REVIEW', 'PAUSED'];

const statusStyles: Record<Status, string> = {
  ACTIVE: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  DEPLOYING: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  PLANNING: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  REVIEW: 'border-amber-300/50 bg-amber-400/15 text-amber-100',
  PAUSED: 'border-slate-500/50 bg-slate-800 text-slate-400',
};

function RocketIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-violet-300/30 bg-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.24)]">
      <span className="absolute left-5 top-2 h-7 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
      <span className="absolute left-4 top-5 h-3 w-1 bg-violet-300" />
      <span className="absolute right-4 top-5 h-3 w-1 bg-violet-300" />
      <span className="absolute bottom-2 left-5 h-2 w-2 rounded-full bg-rose-300 blink" />
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4 shadow-[0_0_28px_rgba(14,165,233,0.10)] transition hover:border-cyan-300/45 hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Pill className={statusStyles[project.status]}>{project.status}</Pill>
            <Pill className="border-violet-300/40 bg-violet-400/10 text-violet-100">{project.category}</Pill>
          </div>
          <h3 className="mt-3 text-[18px] font-semibold text-white">{project.name}</h3>
          <p className="mono mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-slate-500">{project.repo}</p>
        </div>
        <div className="text-right">
          <p className="mono text-3xl font-semibold text-cyan-100">{project.progress}%</p>
          <p className="mono text-[10px] uppercase tracking-[0.12em] text-slate-500">progress</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{project.summary}</p>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded bg-slate-800">
          <div
            className="h-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
          <span>Created {project.created}</span>
          <span>{project.route}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {project.metrics.map(([label, value]) => (
          <div key={label} className="rounded border border-slate-700/70 bg-slate-900/70 p-2">
            <p className="mono text-[9px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
            <p className="mono mt-1 text-[12px] text-cyan-100">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-[12px] leading-relaxed text-cyan-100/80">
        {project.activity}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.agents.map((agent) => (
          <span key={agent} className="rounded border border-pink-300/25 bg-pink-400/10 px-2 py-1 text-[10px] text-pink-100">
            {agent}
          </span>
        ))}
        {project.pipelines.map((pipeline) => (
          <span key={pipeline} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
            {pipeline}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Open workspace', 'Tasks', 'Pipelines', 'Deployments', 'Analytics'].map((action) => (
          <button
            key={action}
            type="button"
            className="rounded border border-cyan-300/20 bg-cyan-300/8 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-50 hover:bg-cyan-300/15"
          >
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}

export default function ProjectsDashboard() {
  const [activeStatus, setActiveStatus] = useState<'ALL' | Status>('ALL');
  const visibleProjects = useMemo(
    () => PROJECTS.filter((project) => activeStatus === 'ALL' || project.status === activeStatus),
    [activeStatus],
  );
  const counts = useMemo(
    () => ({
      ALL: PROJECTS.length,
      ACTIVE: PROJECTS.filter((project) => project.status === 'ACTIVE').length,
      DEPLOYING: PROJECTS.filter((project) => project.status === 'DEPLOYING').length,
      PLANNING: PROJECTS.filter((project) => project.status === 'PLANNING').length,
      REVIEW: PROJECTS.filter((project) => project.status === 'REVIEW').length,
      PAUSED: PROJECTS.filter((project) => project.status === 'PAUSED').length,
    }),
    [],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-violet-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <RocketIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-violet-200/75">PROJECT_OS - PRODUCT_SYSTEMS_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Projects</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Products, AI systems, pipelines, repositories, deployments, and operating context</p>
              </div>
            </div>
            <button className="rounded-md bg-violet-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:bg-violet-200">
              + New Project
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Live projects', String(PROJECTS.filter((project) => ['ACTIVE', 'DEPLOYING'].includes(project.status)).length).padStart(2, '0'), 'active systems'],
              ['Avg progress', '68%', 'weighted by module state'],
              ['Agents assigned', '04', 'SkyNode / Inky / Ops / Watchlist'],
              ['Public routes', '03', 'mission / content / calendar'],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-4">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">{label}</p>
                <p className="mt-2 mono text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{hint}</p>
              </div>
            ))}
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => {
                const isActive = activeStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={[
                      'flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold transition',
                      isActive
                        ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/8',
                    ].join(' ')}
                  >
                    <span>{status}</span>
                    <span className="mono rounded border border-slate-600/70 bg-slate-950/70 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {counts[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 2xl:grid-cols-2">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Project Types</h2>
            <div className="mt-4 space-y-2">
              {['AI Systems', 'Content Pipelines', 'Infrastructure', 'Product Development', 'Research'].map((item) => (
                <div key={item} className="rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2 text-[11px] text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Connected Workspaces</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
              {['Tasks', 'Content', 'Calendar', 'Memory', 'Docs', 'Deployments'].map((item) => (
                <div key={item} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>{item}</span>
                  <span className="text-violet-100">linked</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Operating Read</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
              Mission Control is the current flagship project. Shazam and TerraView are reusable product demos. OpenClaw Ops is the infrastructure layer underneath the Telegram-first workflow.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

