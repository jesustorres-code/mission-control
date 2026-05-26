'use client';

import { useEffect, useState } from 'react';
import type { LogEntry, LogLevel, ModelActivity, ModelActivityKind, ModelKey } from '../../lib/mission-control';

type LogsTab = 'Audit Trail' | 'Model Activity';

const levelStyles: Record<LogLevel, string> = {
  INFO: 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100',
  ACTION: 'border-violet-300/40 bg-violet-300/10 text-violet-100',
  WARN: 'border-rose-300/40 bg-rose-300/10 text-rose-100',
  DONE: 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100',
};

const modelStyles: Record<ModelKey, string> = {
  'openai/gpt-5.5': 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  'google/gemini-2.0-flash': 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  'groq/openai/gpt-oss-120b': 'border-violet-300/50 bg-violet-400/15 text-violet-100',
};

const kindStyles: Record<ModelActivityKind, string> = {
  coordination: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100',
  volume: 'border-cyan-300/40 bg-cyan-400/10 text-cyan-100',
  speed: 'border-violet-300/40 bg-violet-400/10 text-violet-100',
  code: 'border-amber-300/40 bg-amber-400/10 text-amber-100',
  review: 'border-pink-300/40 bg-pink-400/10 text-pink-100',
  system: 'border-slate-300/40 bg-slate-400/10 text-slate-100',
};

function Pill({ children, className = '' }: { children: string; className?: string }) {
  return <span className={'inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ' + className}>{children}</span>;
}

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<LogsTab>('Audit Trail');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [modelActivity, setModelActivity] = useState<ModelActivity[]>([]);
  const [status, setStatus] = useState('Loading MySQL audit trail...');

  async function loadLogs() {
    const [logsResponse, activityResponse] = await Promise.all([
      fetch('/api/logs', { cache: 'no-store' }),
      fetch('/api/model-activity', { cache: 'no-store' }),
    ]);
    const logsData = await logsResponse.json() as { logs?: LogEntry[]; error?: string };
    const activityData = await activityResponse.json() as { activity?: ModelActivity[]; error?: string };
    if (!logsResponse.ok) throw new Error(logsData.error ?? 'Unable to load logs');
    if (!activityResponse.ok) throw new Error(activityData.error ?? 'Unable to load model activity');
    setLogs(logsData.logs ?? []);
    setModelActivity(activityData.activity ?? []);
    setStatus('MySQL audit + model activity live');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load logs'));
  }, []);

  const modelTotals = modelActivity.reduce<Record<string, { count: number; input: number; output: number }>>((totals, entry) => {
    const current = totals[entry.alias] ?? { count: 0, input: 0, output: 0 };
    totals[entry.alias] = {
      count: current.count + 1,
      input: current.input + entry.inputTokens,
      output: current.output + entry.outputTokens,
    };
    return totals;
  }, {});

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Logs</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Operational Audit Trail</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Persistent stream of agent actions, model usage, product decisions, API changes and system events.</p>
          </div>
          <button type="button" onClick={loadLogs} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[12px] font-semibold text-cyan-50 hover:bg-cyan-300/20">Refresh</button>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-md border border-cyan-300/15 bg-slate-950/65 p-4">
          <h2 className="text-sm font-semibold text-white">Runtime Channels</h2>
          <p className="mt-2 text-xs text-slate-400">{status}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['Audit Trail', 'Model Activity'] as LogsTab[]).map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={'rounded-md border px-3 py-2 text-[12px] font-semibold ' + (activeTab === tab ? 'border-cyan-300 bg-cyan-300/15 text-cyan-50' : 'border-slate-700 bg-slate-900/70 text-slate-300')}>
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {['Tasks API', 'Logs API', 'Model Activity API', 'MySQL Database', 'Mission Control UI', 'Cloudflare Tunnel'].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2">
                <span className="text-xs text-slate-300">{item}</span>
                <span className="mono text-[10px] text-cyan-100">{index === 5 ? 'WATCH' : 'LIVE'}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <h3 className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Model totals</h3>
            {['coordinator', 'gemini-flash', 'groq'].map((alias) => {
              const totals = modelTotals[alias] ?? { count: 0, input: 0, output: 0 };
              return (
                <div key={alias} className="rounded border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-100">{alias}</span>
                    <span className="mono text-[10px] text-cyan-100">{totals.count} events</span>
                  </div>
                  <p className="mono mt-1 text-[10px] text-slate-500">{totals.input.toLocaleString()} in / {totals.output.toLocaleString()} out</p>
                </div>
              );
            })}
          </div>
        </aside>

        {activeTab === 'Audit Trail' ? (
          <div className="rounded-md border border-cyan-300/15 bg-slate-950/65">
            <div className="grid grid-cols-[0.55fr_0.8fr_0.72fr_1fr] gap-3 border-b border-cyan-300/10 px-4 py-3 mono text-[10px] uppercase tracking-[0.14em] text-slate-500 md:grid-cols-[0.45fr_0.72fr_0.58fr_0.7fr_2fr_0.9fr]">
              <span>Time</span><span>Actor</span><span>Level</span><span className="hidden md:block">Area</span><span>Message</span><span className="hidden md:block">Source</span>
            </div>
            <div className="divide-y divide-cyan-300/10">
              {logs.map((entry) => (
                <article key={entry.id} className="grid grid-cols-[0.55fr_0.8fr_0.72fr_1fr] gap-3 px-4 py-3 md:grid-cols-[0.45fr_0.72fr_0.58fr_0.7fr_2fr_0.9fr]">
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
        ) : (
          <div className="rounded-md border border-cyan-300/15 bg-slate-950/65">
            <div className="grid grid-cols-[0.5fr_0.95fr_0.65fr_1.2fr] gap-3 border-b border-cyan-300/10 px-4 py-3 mono text-[10px] uppercase tracking-[0.14em] text-slate-500 md:grid-cols-[0.4fr_0.72fr_0.72fr_0.6fr_1.2fr_1.6fr_0.7fr]">
              <span>Time</span><span>Model</span><span className="hidden md:block">Actor</span><span>Kind</span><span>Task</span><span className="hidden md:block">Outcome</span><span>Tokens</span>
            </div>
            <div className="divide-y divide-cyan-300/10">
              {modelActivity.map((entry) => (
                <article key={entry.id} className="grid grid-cols-[0.5fr_0.95fr_0.65fr_1.2fr] gap-3 px-4 py-3 md:grid-cols-[0.4fr_0.72fr_0.72fr_0.6fr_1.2fr_1.6fr_0.7fr]">
                  <span className="mono text-[11px] text-cyan-200/80">{entry.time}</span>
                  <div className="min-w-0">
                    <Pill className={modelStyles[entry.model]}>{entry.alias}</Pill>
                    <p className="mt-1 truncate mono text-[10px] text-slate-500">{entry.model}</p>
                  </div>
                  <span className="hidden text-xs font-semibold text-slate-200 md:block">{entry.actor}</span>
                  <Pill className={kindStyles[entry.kind]}>{entry.kind}</Pill>
                  <span className="text-xs leading-5 text-slate-200">{entry.task}</span>
                  <span className="hidden text-xs leading-5 text-slate-400 md:block">{entry.outcome}</span>
                  <span className="mono text-[10px] text-slate-400">{entry.inputTokens.toLocaleString()} / {entry.outputTokens.toLocaleString()}</span>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
