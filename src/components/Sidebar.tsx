'use client';

import { useState } from 'react';
import PixelOctopus from './PixelOctopus';
import PixelIcon from './PixelIcon';

type NavItem = { id: string; label: string; icon: 'home' | 'agents' | 'tasks' | 'logs' | 'settings' };

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview',  icon: 'home'     },
  { id: 'agents',   label: 'Agents',    icon: 'agents'   },
  { id: 'tasks',    label: 'Tasks',     icon: 'tasks'    },
  { id: 'logs',     label: 'Logs',      icon: 'logs'     },
  { id: 'settings', label: 'Settings',  icon: 'settings' },
];

const VERSION = '0.1.0';

export default function Sidebar() {
  const [active, setActive] = useState('overview');
  const online = true;

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col border-r border-[color:var(--border)] bg-white">
      {/* Branding */}
      <div className="px-4 pt-5 pb-4 border-b border-[color:var(--border)] pixel-grid">
        <div className="flex items-center gap-2.5">
          <PixelOctopus size={24} color="var(--primary)" />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-tight text-[color:var(--foreground)]">
              Lonely Octopus
            </span>
            <span className="text-[11px] text-[color:var(--muted)] mono">Mission Control</span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 flex items-center gap-2 text-[11px] mono text-[color:var(--muted)]">
          <PixelOctopus
            size={10}
            color={online ? '#16a34a' : '#9ca3af'}
            className={online ? 'blink' : ''}
          />
          <span>{online ? 'AGENT ONLINE' : 'AGENT OFFLINE'}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={[
                'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-[color:var(--highlight)] text-[color:var(--primary)]'
                  : 'text-[color:var(--foreground)] hover:bg-[color:var(--surface)]',
              ].join(' ')}
            >
              <PixelIcon
                name={item.icon}
                size={14}
                color={isActive ? 'var(--primary)' : 'var(--muted)'}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Version */}
      <div className="px-4 py-3 border-t border-[color:var(--border)]">
        <div className="text-[10px] mono text-[color:var(--muted)] flex items-center justify-between">
          <span>v{VERSION}</span>
          <span>build #0001</span>
        </div>
      </div>
    </aside>
  );
}
