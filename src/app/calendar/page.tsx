'use client';

import { useMemo, useState } from 'react';

type AutomationType = 'daily' | 'recurring' | 'one-shot';
type ExecutionState = 'enabled' | 'disabled';
type Agent = 'SkyNode' | 'Inky' | 'Ops Team' | 'Watchlist Engine';

type Workflow = {
  name: string;
  type: AutomationType;
  state: ExecutionState;
  schedule: string;
  timezone: string;
  agent: Agent;
  nextRun: string;
  lastRun: string;
  channel: string;
  description: string;
  pipeline: string[];
};

const WORKFLOWS: Workflow[] = [
  {
    name: 'Morning Operator Brief',
    type: 'daily',
    state: 'enabled',
    schedule: '0 8 * * *',
    timezone: 'America/Mexico_City',
    agent: 'SkyNode',
    nextRun: 'next: in 5h 29m',
    lastRun: 'last: pending today',
    channel: 'Telegram + voice note',
    description:
      'Generate a concise operating brief for Guillermo with service status, active URLs, project deltas, upcoming work, and anything urgent from memory or connected systems.',
    pipeline: ['memory scan', 'service health', 'project summary', 'telegram delivery'],
  },
  {
    name: 'Mission Control Deployment Watch',
    type: 'recurring',
    state: 'enabled',
    schedule: 'every 30m',
    timezone: 'America/Mexico_City',
    agent: 'Ops Team',
    nextRun: 'next: in 18m',
    lastRun: 'last: 12m ago',
    channel: 'Internal monitor',
    description:
      'Poll Mission Control services, Cloudflare tunnel reachability, Next.js response codes, and whether local commits are ahead of GitHub origin.',
    pipeline: ['systemd status', 'public URL check', 'git delta', 'alert routing'],
  },
  {
    name: 'Watchlist Signal Refresh',
    type: 'recurring',
    state: 'enabled',
    schedule: 'every 2h',
    timezone: 'America/Mexico_City',
    agent: 'Watchlist Engine',
    nextRun: 'next: in 1h 41m',
    lastRun: 'last: 19m ago',
    channel: 'Content / Watchlist',
    description:
      'Re-score topics using workspace memory, repo activity, Telegram build loops, deployments, project docs, and current agent workflows.',
    pipeline: ['source ingest', 'semantic clustering', 'score ranking', 'idea generation'],
  },
  {
    name: 'Content Idea Router',
    type: 'daily',
    state: 'enabled',
    schedule: '30 18 * * *',
    timezone: 'America/Mexico_City',
    agent: 'Inky',
    nextRun: 'next: in 16h 59m',
    lastRun: 'last: yesterday',
    channel: 'Mission Control tasks',
    description:
      'Convert high-scoring Watchlist signals into actionable content tasks with owner, priority, path, instructions, and context.',
    pipeline: ['watchlist query', 'opportunity scoring', 'task draft', 'owner assignment'],
  },
  {
    name: 'One-shot GitHub Push Reminder',
    type: 'one-shot',
    state: 'enabled',
    schedule: '2026-05-24 09:30',
    timezone: 'America/Mexico_City',
    agent: 'SkyNode',
    nextRun: 'next: in 6h 59m',
    lastRun: 'not run',
    channel: 'Telegram',
    description:
      'Remind Guillermo that Mission Control has local commits ahead of origin and ask before pushing to GitHub.',
    pipeline: ['git status', 'confirm intent', 'telegram reminder'],
  },
  {
    name: 'LinkedIn Research Loop',
    type: 'recurring',
    state: 'disabled',
    schedule: 'manual trigger',
    timezone: 'America/Mexico_City',
    agent: 'SkyNode',
    nextRun: 'paused',
    lastRun: 'not scheduled',
    channel: 'Private workspace',
    description:
      'Reserved workflow for profile and opportunity research. Disabled until Guillermo provides a concrete target and safe source plan.',
    pipeline: ['target definition', 'source scan', 'summary', 'next actions'],
  },
];

const TYPES: Array<'all' | AutomationType> = ['all', 'daily', 'recurring', 'one-shot'];

const typeStyles: Record<AutomationType, string> = {
  daily: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  recurring: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  'one-shot': 'border-pink-300/50 bg-pink-400/15 text-pink-100',
};

const stateStyles: Record<ExecutionState, string> = {
  enabled: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  disabled: 'border-slate-500/50 bg-slate-800/80 text-slate-400',
};

function SchedulerIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-cyan-300/30 bg-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
      <span className="absolute left-2 top-3 h-6 w-7 rounded border border-cyan-300/70" />
      <span className="absolute left-2 top-5 h-px w-7 bg-cyan-300/70" />
      <span className="absolute left-4 top-1.5 h-4 w-0.5 rounded bg-violet-300" />
      <span className="absolute right-4 top-1.5 h-4 w-0.5 rounded bg-violet-300" />
      <span className="absolute bottom-3 left-4 h-1.5 w-1.5 rounded-full bg-cyan-300 blink" />
      <span className="absolute bottom-3 right-4 h-1.5 w-1.5 rounded-full bg-violet-300" />
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

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4 shadow-[0_0_28px_rgba(14,165,233,0.10)] transition hover:border-cyan-300/45 hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <Pill className={typeStyles[workflow.type]}>{workflow.type}</Pill>
            <Pill className={stateStyles[workflow.state]}>{workflow.state}</Pill>
          </div>
          <h3 className="mt-3 text-[16px] font-semibold text-white">{workflow.name}</h3>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{workflow.agent} - {workflow.channel}</p>
        </div>
        <div className="text-right">
          <p className="mono text-[12px] font-semibold text-cyan-100">{workflow.nextRun}</p>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{workflow.lastRun}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className="rounded border border-slate-700/70 bg-slate-900/70 p-3">
          <p className="mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Schedule</p>
          <p className="mono mt-1 text-[12px] text-cyan-100">{workflow.schedule}</p>
        </div>
        <div className="rounded border border-slate-700/70 bg-slate-900/70 p-3">
          <p className="mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Timezone</p>
          <p className="mono mt-1 text-[12px] text-cyan-100">{workflow.timezone}</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{workflow.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {workflow.pipeline.map((step) => (
          <span key={step} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
            {step}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Run now', workflow.state === 'enabled' ? 'Pause' : 'Enable', 'Logs', 'Duplicate'].map((action) => (
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

export default function SchedulerDashboard() {
  const [activeType, setActiveType] = useState<'all' | AutomationType>('all');
  const visibleWorkflows = useMemo(
    () => WORKFLOWS.filter((workflow) => activeType === 'all' || workflow.type === activeType),
    [activeType],
  );

  const counts = useMemo(
    () => ({
      all: WORKFLOWS.length,
      daily: WORKFLOWS.filter((workflow) => workflow.type === 'daily').length,
      recurring: WORKFLOWS.filter((workflow) => workflow.type === 'recurring').length,
      'one-shot': WORKFLOWS.filter((workflow) => workflow.type === 'one-shot').length,
    }),
    [],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-cyan-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SchedulerIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/75">SCHEDULER_CORE - TEMPORAL_AUTOMATION_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Scheduler</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Cron, reminders, agent runs, pipelines, and Telegram delivery</p>
              </div>
            </div>
            <button className="rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">
              + New Automation
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Enabled workflows', String(WORKFLOWS.filter((workflow) => workflow.state === 'enabled').length).padStart(2, '0'), 'active scheduler'],
              ['Next execution', '18m', 'deployment watch'],
              ['Channels', '03', 'telegram / internal / content'],
              ['Timezone anchor', 'CST', 'America/Mexico_City'],
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
              {TYPES.map((type) => {
                const isActive = activeType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={[
                      'flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold capitalize transition',
                      isActive
                        ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/8',
                    ].join(' ')}
                  >
                    <span>{type}</span>
                    <span className="mono rounded border border-slate-600/70 bg-slate-950/70 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {counts[type]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-3">
            {visibleWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.name} workflow={workflow} />
            ))}
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Automation Types</h2>
            <div className="mt-4 space-y-2">
              <Pill className={typeStyles.daily}>daily</Pill>
              <Pill className={typeStyles.recurring}>recurring</Pill>
              <Pill className={typeStyles['one-shot']}>one-shot</Pill>
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Runtime Capabilities</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
              {['cron expressions', 'interval scheduling', 'timezone handling', 'telegram notify', 'agent prompts', 'manual run', 'logs / history'].map((item) => (
                <div key={item} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>{item}</span>
                  <span className="text-violet-100">ready</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Control Note</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
              This module is modeled as an AI automation tower, not a calendar grid: every card represents a runnable workflow with schedule, agent, channel, status, and execution controls.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

