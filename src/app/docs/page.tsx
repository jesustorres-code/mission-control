'use client';

import { useMemo, useState } from 'react';

type DocCategory = 'README' | 'Memory' | 'Ops' | 'Spec' | 'Research' | 'Prompt' | 'Product' | 'Notes';

type Doc = {
  title: string;
  path: string;
  category: DocCategory;
  words: number;
  updated: string;
  summary: string;
  links: string[];
  tags: string[];
  relevance: number;
};

const DOCS: Doc[] = [
  {
    title: 'Mission Control README',
    path: 'projects/mission-control/README.md',
    category: 'README',
    words: 214,
    updated: '2026-05-24',
    summary: 'Project overview for the Lonely Octopus Mission Control dashboard, including stack, structure, planned screens, and development commands.',
    links: ['Mission Control', 'Projects', 'Tasks'],
    tags: ['nextjs', 'dashboard', 'readme'],
    relevance: 96,
  },
  {
    title: 'Mission Control OpenClaw Instructions',
    path: 'projects/mission-control/OPENCLAW_INSTRUCTIONS.md',
    category: 'Prompt',
    words: 1040,
    updated: '2026-05-24',
    summary: 'Prompt and implementation brief for reproducing the Mission Control dashboard structure and visual direction with OpenClaw.',
    links: ['Prompts', 'Agents', 'Mission Control'],
    tags: ['prompt', 'openclaw', 'ui-brief'],
    relevance: 91,
  },
  {
    title: 'Long-Term Memory',
    path: 'MEMORY.md',
    category: 'Memory',
    words: 112,
    updated: '2026-05-24',
    summary: 'Curated durable memory: Guillermo identity, SkyNode purpose, Telegram voice preference, and operating defaults.',
    links: ['Memory', 'SkyNode', 'Guillermo'],
    tags: ['identity', 'preference', 'long-term'],
    relevance: 94,
  },
  {
    title: 'Daily Memory 2026-05-24',
    path: 'memory/2026-05-24.md',
    category: 'Memory',
    words: 890,
    updated: '2026-05-24',
    summary: 'Operational journal for today: Mission Control deployment, Tasks, Content, Calendar, Projects, Memory, commits, and verification gates.',
    links: ['Daily Log', 'Commits', 'Mission Control'],
    tags: ['daily-log', 'ops', 'commits'],
    relevance: 98,
  },
  {
    title: 'Tools Local Notes',
    path: 'TOOLS.md',
    category: 'Ops',
    words: 468,
    updated: '2026-05-20',
    summary: 'Local operational notes: Telegram voice replies, TTS helper, dashboard route, Apache proxy, project workspace, and active project conventions.',
    links: ['Ops', 'Telegram', 'Dashboard'],
    tags: ['tools', 'tts', 'apache', 'workspace'],
    relevance: 88,
  },
  {
    title: 'Shazam Popular Segments README',
    path: 'projects/shazam-popular-segments/README.md',
    category: 'Product',
    words: 1880,
    updated: '2026-05-20',
    summary: 'Documentation for the audio intelligence project: setup, API, UI, providers, public test route, and workflow for extracting popular clips.',
    links: ['Shazam Popular Segments', 'Projects', 'Audio'],
    tags: ['audio', 'shazam', 'api', 'clips'],
    relevance: 84,
  },
  {
    title: 'Shazam Flask YouTube Music Notes',
    path: 'projects/shazam-popular-segments/docs/flask-youtube-music.md',
    category: 'Research',
    words: 620,
    updated: '2026-05-20',
    summary: 'Notes for the YouTube Music focused Flask app, Cloudflare tunnel usage, preview provider, and removed scope decisions.',
    links: ['YouTube Music', 'Shazam', 'Research'],
    tags: ['youtube-music', 'flask', 'preview-provider'],
    relevance: 75,
  },
  {
    title: 'Agent Workspace Instructions',
    path: 'AGENTS.md',
    category: 'Ops',
    words: 1390,
    updated: '2026-05-24',
    summary: 'Workspace rules for memory, Telegram replies, group chat behavior, heartbeats, external actions, and internal safety practices.',
    links: ['Agents', 'Memory', 'Safety'],
    tags: ['agents', 'rules', 'memory', 'telegram'],
    relevance: 87,
  },
  {
    title: 'SkyNode Identity',
    path: 'IDENTITY.md',
    category: 'Memory',
    words: 62,
    updated: '2026-05-16',
    summary: 'Identity seed for SkyNode: name, creature, vibe, emoji, and avatar placeholder.',
    links: ['SkyNode', 'Identity', 'Memory'],
    tags: ['identity', 'persona', 'skynode'],
    relevance: 72,
  },
];

const CATEGORIES: Array<'All' | DocCategory> = ['All', 'README', 'Memory', 'Ops', 'Spec', 'Research', 'Prompt', 'Product', 'Notes'];

const categoryStyles: Record<DocCategory, string> = {
  README: 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100',
  Memory: 'border-violet-300/50 bg-violet-400/15 text-violet-100',
  Ops: 'border-emerald-300/50 bg-emerald-400/15 text-emerald-100',
  Spec: 'border-amber-300/50 bg-amber-400/15 text-amber-100',
  Research: 'border-blue-300/50 bg-blue-400/15 text-blue-100',
  Prompt: 'border-pink-300/50 bg-pink-400/15 text-pink-100',
  Product: 'border-rose-300/50 bg-rose-400/15 text-rose-100',
  Notes: 'border-slate-300/40 bg-slate-400/10 text-slate-200',
};

function DocIcon() {
  return (
    <div className="relative h-11 w-11 rounded-md border border-cyan-300/30 bg-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
      <span className="absolute left-3 top-2 h-7 w-5 rounded border border-cyan-300/70 bg-cyan-300/5" />
      <span className="absolute right-3 top-2 h-2 w-2 border-l border-b border-cyan-300/70 bg-slate-950" />
      <span className="absolute left-4 top-5 h-px w-3 bg-violet-300" />
      <span className="absolute left-4 top-7 h-px w-4 bg-cyan-300" />
      <span className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-violet-300 blink" />
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

function DocumentCard({ doc }: { doc: Doc }) {
  return (
    <article className="rounded-md border border-cyan-300/15 bg-slate-950/72 p-4 shadow-[0_0_28px_rgba(14,165,233,0.10)] transition hover:border-cyan-300/45 hover:shadow-[0_0_34px_rgba(34,211,238,0.18)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Pill className={categoryStyles[doc.category]}>{doc.category}</Pill>
            <Pill className="border-slate-500/50 bg-slate-800 text-slate-300">{doc.words.toLocaleString()} words</Pill>
          </div>
          <h3 className="mt-3 text-[15px] font-semibold text-white">{doc.title}</h3>
          <p className="mono mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-cyan-200/60">{doc.path}</p>
        </div>
        <div className="text-right">
          <p className="mono text-2xl font-semibold text-cyan-100">{doc.relevance}</p>
          <p className="mono text-[10px] uppercase tracking-[0.12em] text-slate-500">rank</p>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-slate-300">{doc.summary}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {doc.links.map((link) => (
          <span key={link} className="rounded border border-violet-300/25 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-100">
            {link}
          </span>
        ))}
        {doc.tags.map((tag) => (
          <span key={tag} className="rounded border border-slate-600/50 px-2 py-1 text-[10px] text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="mono text-[10px] uppercase tracking-[0.12em] text-slate-500">Updated {doc.updated}</p>
        <div className="flex flex-wrap gap-2">
          {['Open', 'Ask AI', 'Inject', 'Link'].map((action) => (
            <button
              key={action}
              type="button"
              className="rounded border border-cyan-300/20 bg-cyan-300/8 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-50 hover:bg-cyan-300/15"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function DocsDashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | DocCategory>('All');

  const visibleDocs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return DOCS.filter((doc) => {
      const matchesCategory = category === 'All' || doc.category === category;
      const haystack = [doc.title, doc.path, doc.summary, doc.category, ...doc.links, ...doc.tags].join(' ').toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    }).sort((a, b) => b.relevance - a.relevance);
  }, [query, category]);

  const counts = useMemo(
    () => ({
      All: DOCS.length,
      README: DOCS.filter((doc) => doc.category === 'README').length,
      Memory: DOCS.filter((doc) => doc.category === 'Memory').length,
      Ops: DOCS.filter((doc) => doc.category === 'Ops').length,
      Spec: DOCS.filter((doc) => doc.category === 'Spec').length,
      Research: DOCS.filter((doc) => doc.category === 'Research').length,
      Prompt: DOCS.filter((doc) => doc.category === 'Prompt').length,
      Product: DOCS.filter((doc) => doc.category === 'Product').length,
      Notes: DOCS.filter((doc) => doc.category === 'Notes').length,
    }),
    [],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <header className="border-b border-violet-300/15 bg-slate-950/90">
        <div className="pixel-grid px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <DocIcon />
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-violet-200/75">DOCS_CORE - SEMANTIC_KNOWLEDGE_LIVE</p>
                <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">Docs</h1>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">Markdown, prompts, memory, project docs, operational notes, and AI-readable context</p>
              </div>
            </div>
            <button className="rounded-md bg-violet-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(167,139,250,0.45)] hover:bg-violet-200">
              + Add Doc
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 px-8 py-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0 space-y-5">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ['Indexed docs', String(DOCS.length).padStart(2, '0'), 'curated knowledge files'],
              ['Memory docs', String(counts.Memory).padStart(2, '0'), 'daily + long-term'],
              ['Project docs', '04', 'mission / shazam / ops'],
              ['Search mode', 'hybrid', 'text + semantic-ready'],
            ].map(([label, value, hint]) => (
              <div key={label} className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-4">
                <p className="mono text-[10px] uppercase tracking-[0.16em] text-cyan-200/65">{label}</p>
                <p className="mt-2 mono text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{hint}</p>
              </div>
            ))}
          </section>

          <section className="rounded-md border border-violet-300/15 bg-slate-950/68 p-3">
            <label className="block">
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Search docs...</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, path, tag, workflow, memory, prompt..."
                className="mt-2 w-full rounded-md border border-cyan-300/20 bg-slate-900/80 px-3 py-3 text-[13px] text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-300/60"
              />
            </label>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/68 p-2">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => {
                const isActive = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={[
                      'flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-semibold transition',
                      isActive
                        ? 'border-cyan-300/70 bg-cyan-300/15 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.18)]'
                        : 'border-slate-700/70 bg-slate-900/70 text-slate-300 hover:border-cyan-300/35 hover:bg-cyan-300/8',
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

          <section className="grid gap-3">
            {visibleDocs.map((doc) => (
              <DocumentCard key={doc.path} doc={doc} />
            ))}
          </section>
        </main>

        <aside className="space-y-5">
          <section className="rounded-md border border-violet-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Knowledge Layers</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-violet-100/80">
              {['Raw Documents', 'Metadata Extraction', 'Semantic Embeddings', 'AI Retrieval', 'Agent Context Injection'].map((layer) => (
                <div key={layer} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>{layer}</span>
                  <span className="text-cyan-100">ready</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4">
            <h2 className="text-[13px] font-semibold text-white">Connected Context</h2>
            <div className="mt-4 space-y-2 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100/80">
              {['Memory', 'Tasks', 'Projects', 'Calendar', 'Content', 'Agents'].map((item) => (
                <div key={item} className="flex justify-between rounded border border-slate-700/70 bg-slate-900/70 px-2 py-2">
                  <span>{item}</span>
                  <span className="text-violet-100">linked</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-300/15 bg-cyan-300/8 p-4">
            <h2 className="text-[13px] font-semibold text-white">Retrieval Note</h2>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-300">
              This view is curated from Guillermo’s own markdown and project docs. Search is implemented as local contextual filtering and structured as a future semantic/vector retrieval surface.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

