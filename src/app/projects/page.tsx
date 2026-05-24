'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Project, ProjectStatus } from '../../lib/mission-control';

const STATUSES: Array<'ALL' | ProjectStatus> = ['ALL', 'ACTIVE', 'DEPLOYING', 'PLANNING', 'REVIEW', 'PAUSED'];

const statusStyles: Record<ProjectStatus, string> = {
  ACTIVE: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  DEPLOYING: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  PLANNING: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  REVIEW: 'border-amber-300/50 bg-amber-400/15 text-amber-100',
  PAUSED: 'border-slate-500/50 bg-slate-800 text-slate-400',
};

function Pill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${className}`}>{children}</span>;
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return (
    <button type="button" onClick={() => onSelect(project)} className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4 text-left shadow-[0_0_28px_rgba(14,165,233,0.10)] transition hover:border-cyan-300/45 hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2"><Pill className={statusStyles[project.status]}>{project.status}</Pill><Pill className="border-violet-300/40 bg-violet-400/10 text-violet-100">{project.category}</Pill></div>
          <h3 className="mt-3 text-[18px] font-semibold text-white">{project.name}</h3>
          <p className="mono mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-slate-500">{project.repo}</p>
        </div>
        <div className="text-right"><p className="mono text-3xl font-semibold text-cyan-100">{project.progress}%</p><p className="mono text-[10px] uppercase tracking-[0.12em] text-slate-500">progress</p></div>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{project.summary}</p>
      <div className="mt-4 h-2 overflow-hidden rounded bg-slate-800"><div className="h-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" style={{ width: `${project.progress}%` }} /></div>
      <p className="mt-2 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{project.route}</p>
      <p className="mt-4 rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-[12px] leading-relaxed text-cyan-100/80">{project.activity}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.agents.map((agent) => <span key={agent} className="rounded border border-pink-300/25 bg-pink-400/10 px-2 py-1 text-[10px] text-pink-100">{agent}</span>)}
        {project.pipelines.map((pipeline) => <span key={pipeline} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">{pipeline}</span>)}
      </div>
    </button>
  );
}

function ProjectDetail({ project, onClose, onSave }: { project: Project; onClose: () => void; onSave: (project: Project) => void }) {
  const [draft, setDraft] = useState(project);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(project);
  }, [project]);

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-[430px] overflow-y-auto border-l border-cyan-300/20 bg-slate-950/95 p-5 shadow-[0_0_42px_rgba(14,165,233,0.18)] backdrop-blur">
      <div className="flex items-start justify-between gap-4"><div><p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">{draft.id}</p><h2 className="mt-2 text-xl font-semibold text-white">{draft.name}</h2></div><button type="button" onClick={onClose} className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-300 hover:border-cyan-300 hover:text-cyan-100">Close</button></div>
      <div className="mt-5 grid gap-3">
        <label className="grid gap-1"><span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Status</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ProjectStatus })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none">{STATUSES.filter((status) => status !== 'ALL').map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="grid gap-1"><span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Progress</span><input type="number" min="0" max="100" value={draft.progress} onChange={(event) => setDraft({ ...draft, progress: Number(event.target.value) })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none" /></label>
        <label className="grid gap-1"><span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Activity</span><textarea rows={4} value={draft.activity} onChange={(event) => setDraft({ ...draft, activity: event.target.value })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none" /></label>
        <button type="button" onClick={() => onSave(draft)} className="rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">Save project</button>
      </div>
    </aside>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'ALL' | ProjectStatus>('ALL');
  const [selected, setSelected] = useState<Project | null>(null);
  const [status, setStatus] = useState('Loading MySQL projects...');

  async function loadProjects() {
    const response = await fetch('/api/projects', { cache: 'no-store' });
    const data = await response.json() as { projects?: Project[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? 'Unable to load projects');
    setProjects(data.projects ?? []);
    setStatus('Projects persisted in MySQL');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load projects'));
  }, []);

  async function saveProject(project: Project) {
    const response = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) });
    const data = await response.json() as { project?: Project; error?: string };
    if (!response.ok || !data.project) { setStatus(data.error ?? 'Unable to save project'); return; }
    setProjects((current) => current.map((item) => item.id === project.id ? project : item));
    setSelected(project);
    setStatus(`Saved ${project.name} to MySQL`);
  }

  const visible = useMemo(() => projects.filter((project) => filter === 'ALL' || project.status === filter), [filter, projects]);

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Projects</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Project Operating Layer</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">MySQL-backed registry for active products, infrastructure and research systems.</p><p className="mt-1 text-xs text-cyan-100/75">{status}</p></div><button type="button" onClick={loadProjects} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[12px] font-semibold text-cyan-50 hover:bg-cyan-300/20">Refresh</button></div></section>
      <section className="px-6 py-5"><div className="mb-5 flex flex-wrap gap-2">{STATUSES.map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-md border px-3 py-2 text-[12px] font-semibold ${filter === status ? 'border-cyan-300 bg-cyan-300/15 text-cyan-50' : 'border-slate-700 bg-slate-900/70 text-slate-300'}`}>{status}</button>)}</div><div className="grid gap-4 xl:grid-cols-2">{visible.map((project) => <ProjectCard key={project.id} project={project} onSelect={setSelected} />)}</div></section>
      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} onSave={saveProject} />}
    </main>
  );
}
