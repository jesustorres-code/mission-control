'use client';

import { useEffect, useState } from 'react';
import type { SettingGroup } from '../../lib/mission-control';

const statusOptions: SettingGroup['status'][] = ['Configured', 'Active', 'Planned'];

export default function SettingsPage() {
  const [groups, setGroups] = useState<SettingGroup[]>([]);
  const [selected, setSelected] = useState<SettingGroup | null>(null);
  const [status, setStatus] = useState('Loading MySQL settings...');

  async function loadSettings() {
    const response = await fetch('/api/settings', { cache: 'no-store' });
    const data = await response.json() as { settings?: SettingGroup[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? 'Unable to load settings');
    setGroups(data.settings ?? []);
    setSelected((current) => current ? (data.settings ?? []).find((group) => group.id === current.id) ?? current : null);
    setStatus('Settings persisted in MySQL');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings().catch((error) => setStatus(error instanceof Error ? error.message : 'Unable to load settings'));
  }, []);

  async function saveGroup(group: SettingGroup) {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });
    const data = await response.json() as { group?: SettingGroup; error?: string };
    if (!response.ok || !data.group) {
      setStatus(data.error ?? 'Unable to save settings');
      return;
    }
    setGroups((current) => current.map((item) => item.id === group.id ? group : item));
    setSelected(group);
    setStatus(`Saved ${group.title} to MySQL`);
  }

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-slate-100">
      <section className="border-b border-cyan-300/15 bg-slate-950/80 px-6 py-5 pixel-grid">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">Settings</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Control Surface</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Persistent configuration for communication, runtime, workspace paths and integrations.</p>
            <p className="mt-1 text-xs text-cyan-100/75">{status}</p>
          </div>
          <button type="button" onClick={loadSettings} className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-[12px] font-semibold text-cyan-50 hover:bg-cyan-300/20">Refresh</button>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 xl:grid-cols-2">
          {groups.map((group) => (
            <button key={group.id} type="button" onClick={() => setSelected(group)} className="rounded-md border border-cyan-300/15 bg-slate-950/70 p-4 text-left shadow-[0_0_26px_rgba(14,165,233,0.07)] transition hover:border-cyan-300/45">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                  <p className="mt-1 mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{group.id}</p>
                </div>
                <span className="rounded border border-cyan-300/35 bg-cyan-300/10 px-2 py-1 mono text-[10px] uppercase tracking-[0.12em] text-cyan-100">{group.status}</span>
              </div>
              <div className="mt-4 grid gap-2">
                {group.items.map((item) => (
                  <div key={item} className="rounded border border-cyan-300/10 bg-cyan-300/5 px-3 py-2 text-xs text-slate-300">{item}</div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <aside className="rounded-md border border-cyan-300/15 bg-slate-950/75 p-4">
          <h2 className="text-sm font-semibold text-white">Settings Detail</h2>
          {selected ? (
            <div className="mt-4 space-y-4">
              <label className="grid gap-1">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Status</span>
                <select value={selected.status} onChange={(event) => setSelected({ ...selected, status: event.target.value as SettingGroup['status'] })} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm text-white outline-none">
                  {statusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Items</span>
                <textarea value={selected.items.join('\n')} onChange={(event) => setSelected({ ...selected, items: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })} rows={8} className="rounded border border-cyan-300/20 bg-slate-900 px-3 py-2 text-sm leading-6 text-white outline-none" />
              </label>
              <button type="button" onClick={() => saveGroup(selected)} className="w-full rounded-md bg-cyan-300 px-3 py-2 text-[12px] font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:bg-cyan-200">Save settings</button>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-400">Select a setting group to edit persisted values.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
