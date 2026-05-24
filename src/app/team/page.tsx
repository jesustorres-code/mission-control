'use client';

import { useMemo, useState } from 'react';

type EntityType = 'Human' | 'AI Agent' | 'Automation Worker' | 'Workflow Entity';
type Status = 'ALWAYS ON' | 'SCHEDULED' | 'ON-DEMAND';
type Layer = 'Human Layer' | 'Coordinator Agents' | 'Specialized Agents' | 'Workflow Pipelines';

type Member = {
  name: string;
  role: string;
  type: EntityType;
  status: Status;
  layer: Layer;
  model: string;
  color: string;
  initials: string;
  description: string;
  responsibilities: string[];
  relationships: string[];
};

const MEMBERS: Member[] = [
  {
    name: 'Guillermo',
    role: 'Founder / Human Operator',
    type: 'Human',
    status: 'ON-DEMAND',
    layer: 'Human Layer',
    model: 'Human judgment',
    color: '#f8fafc',
    initials: 'G',
    description:
      'Strategic owner of the Mission Control ecosystem. Gives direction through Telegram, approves external actions, and defines product priorities.',
    responsibilities: ['final decisions', 'strategic direction', 'approval gates', 'product taste'],
    relationships: ['Guillermo -> SkyNode', 'Guillermo -> Mission Control roadmap'],
  },
  {
    name: 'SkyNode',
    role: 'Chief of Staff AI',
    type: 'AI Agent',
    status: 'ALWAYS ON',
    layer: 'Coordinator Agents',
    model: 'OpenClaw / GPT runtime',
    color: '#22d3ee',
    initials: 'SN',
    description:
      'Primary coordinator for Telegram operations, service checks, memory capture, voice replies, deployment work, and multi-module Mission Control execution.',
    responsibilities: ['orchestration', 'memory management', 'service monitoring', 'Telegram + voice replies'],
    relationships: ['SkyNode -> Inky', 'SkyNode -> Ops Team', 'SkyNode -> Watchlist Engine'],
  },
  {
    name: 'Inky',
    role: 'AI Product Builder',
    type: 'AI Agent',
    status: 'ON-DEMAND',
    layer: 'Specialized Agents',
    model: 'GPT-coded UI agent',
    color: '#fb7185',
    initials: 'IK',
    description:
      'Specialized product/UI agent used inside Mission Control concepts for Tasks, ownership, visual modules, content routing, and feature implementation.',
    responsibilities: ['UI synthesis', 'task ownership', 'feature shaping', 'content production'],
    relationships: ['Inky -> Tasks', 'Inky -> Content Ideas', 'Inky -> Visual systems'],
  },
  {
    name: 'Watchlist Engine',
    role: 'Trend Intelligence Worker',
    type: 'Automation Worker',
    status: 'SCHEDULED',
    layer: 'Specialized Agents',
    model: 'Semantic scoring pipeline',
    color: '#a78bfa',
    initials: 'WE',
    description:
      'Scores topics from Guillermo’s real ecosystem: repos, Telegram build loops, OpenClaw memory, public deployments, and project docs.',
    responsibilities: ['signal detection', 'topic scoring', 'semantic tags', 'content opportunities'],
    relationships: ['Watchlist Engine -> Content', 'Watchlist Engine -> Docs', 'Watchlist Engine -> Scheduler'],
  },
  {
    name: 'Ops Team',
    role: 'Infrastructure Crew',
    type: 'Automation Worker',
    status: 'ALWAYS ON',
    layer: 'Workflow Pipelines',
    model: 'systemd / shell / gateway',
    color: '#38bdf8',
    initials: 'OPS',
    description:
      'Operational layer for service status, Cloudflare tunnel checks, Apache routes, git state, build verification, and deployment health.',
    responsibilities: ['systemd checks', 'URL health', 'build gates', 'deployment logs'],
    relationships: ['Ops Team -> Projects', 'Ops Team -> Calendar', 'Ops Team -> Mission Control'],
  },
  {
    name: 'Memory Core',
    role: 'Persistent Context System',
    type: 'Workflow Entity',
    status: 'ALWAYS ON',
    layer: 'Workflow Pipelines',
    model: 'Markdown + semantic recall',
    color: '#c084fc',
    initials: 'MC',
    description:
      'Shared continuity layer that keeps identity, daily logs, preferences, project decisions, and curated operational knowledge available to agents.',
    responsibilities: ['daily logs', 'long-term memory', 'semantic recall', 'agent context injection'],
    relationships: ['Memory Core -> SkyNode', 'Memory Core -> Docs', 'Memory Core -> Tasks'],
  },
];

const LAYERS: Layer[] = ['Human Layer', 'Coordinator Agents', 'Specialized Agents', 'Workflow Pipelines'];
const STATUSES: Array<'ALL' | Status> = ['ALL', 'ALWAYS ON', 'SCHEDULED', 'ON-DEMAND'];

const statusStyles: Record<Status, string> = {
  'ALWAYS ON': 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  SCHEDULED: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  'ON-DEMAND': 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
};

function TeamIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-violet-300/30 bg-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.24)]">
      <span className="absolute left-4 top-2 h-3 w-3 rounded border border-cyan-300 bg-cyan-300/10" />
      <span className="absolute left-2 bottom-2 h-3 w-3 rounded border border-violet-300 bg-violet-300/10" />
      <span className="absolute right-2 bottom-2 h-3 w-3 rounded border border-pink-300 bg-pink-300/10" />
      <span className="absolute left-5 top-5 h-4 w-px bg-cyan-300/70" />
      <span className="absolute left-3 top-7 h-px w-6 bg-violet-300/70" />
      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300 blink" />
    </div>
  );
}

function PixelAvatar({ member }: { member: Member }) {
  return (
    <div
      className="relative grid h-12 w-12 shrink-0 place-items-center rounded border bg-slate-950/85 mono text-[11px] font-bold shadow-[0_0_20px_rgba(34,211,238,0.16)]"
      style={{ borderColor: `${member.color}88`, color: member.color }}
    >
      {member.initials}
      <span
        className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-slate-950"
        style={{ backgroundColor: member.color }}
      />
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

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4 shadow-[0_0_28px_rgba(14,165,233,0.10)] transition hover:border-cyan-300/45 hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]">
      <div className="flex items-start gap-3">
        <PixelAvatar member={member} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Pill className={statusStyles[member.status]}>{member.status}</Pill>
            <Pill className="border-violet-300/40 bg-violet-400/10 text-violet-100">{member.type}</Pill>
          </div>
          <h3 className="mt-3 text-[16px] font-semibold text-white">{member.name}</h3>
          <p className="mono mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{member.role} - {member.model}</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{member.description}</p>

      <div className="mt-4">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Responsibilities</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {member.responsibilities.map((item) => (
            <span key={item} className="rounded border border-cyan-300/25 bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-100">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Relationships</p>
        <div className="mt-2 grid gap-1.5">
          {member.relationships.map((item) => (
            <div key={item} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1.5 text-[10px] text-violet-100">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Inspect', 'Chat', 'Logs', 'Run task', 'Edit role'].map((action) => (
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

export default function TeamDashboard() {
  const [status, setStatus] = useState<'ALL' | Status>('ALL');
  const visibleMembers = useMemo(
    () => MEMBERS.filter((member) => status === 'ALL' || member.status === status),
    [status],
  );

  const counts = useMemo(
    () => ({
      ALL: MEMBERS.length,
      'ALWAYS ON': MEMBERS.filter((member) => member.status === 'ALWAYS ON').length,
      SCHEDULED: MEMBERS.filter((member) => member.status === 'SCHEDULED').length,
      'ON-DEMAND': MEMBERS.filter((member) => member.status === 'ON-DEMAND').length,
    }),
    [],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-violet-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TeamIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-violet-200/75">TEAM_GRAPH - AI_WORKFORCE_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Team</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Humans, agents, workflows, automations, and shared memory as one operating crew</p>
              </div>
            </div>
            <button className="rounded-md bg-violet-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:bg-violet-200">
              + Add Agent
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <main className="min-w-0 space-y-5">
          <section className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">Mission Statement</p>
                <h2 className="mt-2 text-[20px] font-semibold text-white">Operate Guillermo’s AI-native workspace from Telegram to deployed products.</h2>
                <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-300">
                  This team coordinates human direction, AI execution, persistent memory, scheduled workflows, content intelligence, project dashboards, and infrastructure checks into one Mission Control system.
                </p>
              </div>
              <Pill className="border-emerald-300/50 bg-emerald-400/15 text-emerald-100">hybrid org online</Pill>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Team entities', String(MEMBERS.length).padStart(2, '0'), 'human + agents + workflows'],
              ['Always on', String(counts['ALWAYS ON']).padStart(2, '0'), 'persistent runtime'],
              ['Scheduled', String(counts.SCHEDULED).padStart(2, '0'), 'automation cadence'],
              ['On demand', String(counts['ON-DEMAND']).padStart(2, '0'), 'request driven'],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-4">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">{label}</p>
                <p className="mt-2 mono text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{hint}</p>
              </div>
            ))}
          </section>

          <section className="rounded-md border border-violet-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((item) => {
                const isActive = status === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={[
                      'flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold transition',
                      isActive
                        ? 'border-violet-300/70 bg-violet-300/15 text-violet-50 shadow-[0_0_22px_rgba(167,139,250,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-violet-300/35 hover:bg-violet-300/8',
                    ].join(' ')}
                  >
                    <span>{item}</span>
                    <span className="mono rounded border border-slate-600/70 bg-slate-950/70 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {counts[item]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            {LAYERS.map((layer) => {
              const members = visibleMembers.filter((member) => member.layer === layer);
              if (members.length === 0) return null;

              return (
                <div key={layer} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{layer}</h2>
                  </div>
                  <div className="grid gap-3 2xl:grid-cols-2">
                    {members.map((member) => (
                      <MemberCard key={member.name} member={member} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Org Layers</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-violet-100/80">
              {LAYERS.map((layer, index) => (
                <div key={layer} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>Layer {index + 1}</span>
                  <span className="text-cyan-100">{layer}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Workflow Chain</h2>
            <div className="mt-4 space-y-2 text-[12px] text-slate-300">
              {['Guillermo -> SkyNode', 'SkyNode -> Inky / Ops Team', 'Watchlist Engine -> Content Ideas', 'Memory Core -> Agents', 'Scheduler -> Automated runs'].map((chain) => (
                <div key={chain} className="rounded border border-cyan-300/15 bg-cyan-300/5 px-3 py-2">
                  {chain}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-violet-300/15 bg-violet-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Operating Principle</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
              Humans decide direction. Coordinator agents preserve context and route work. Specialized agents execute. Workflow entities keep the system running between Telegram requests.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

