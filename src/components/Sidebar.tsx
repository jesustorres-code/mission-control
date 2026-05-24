'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PixelOctopus from './PixelOctopus';
import PixelIcon from './PixelIcon';

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: 'home' | 'agents' | 'tasks' | 'logs' | 'settings'
      | 'content' | 'calendar' | 'projects' | 'memory' | 'docs' | 'team' | 'visual';
  original?: boolean;
  empty?: boolean;
};

const NAV: NavItem[] = [
  { id: 'overview',  label: 'Overview',  href: '/',         icon: 'home',     original: true, empty: true },
  { id: 'agents',    label: 'Agents',    href: '/agents',   icon: 'agents',   original: true, empty: true },
  { id: 'tasks',     label: 'Tasks',     href: '/',         icon: 'tasks',    original: true },
  { id: 'logs',      label: 'Logs',      href: '/logs',     icon: 'logs',     original: true, empty: true },
  { id: 'settings',  label: 'Settings',  href: '/settings', icon: 'settings', original: true, empty: true },
  { id: 'content',   label: 'Content',   href: '/content',  icon: 'content'   },
  { id: 'calendar',  label: 'Calendar',  href: '/calendar', icon: 'calendar'  },
  { id: 'projects',  label: 'Projects',  href: '/projects', icon: 'projects'  },
  { id: 'memory',    label: 'Memory',    href: '/memory',   icon: 'memory'    },
  { id: 'docs',      label: 'Docs',      href: '/docs',     icon: 'docs'      },
  { id: 'team',      label: 'Team',      href: '/team',     icon: 'team'      },
  { id: 'visual',    label: 'Visual',    href: '/visual',   icon: 'visual',   empty: true },
];

const VERSION = '0.1.0';

export default function Sidebar() {
  const pathname = usePathname();
  const online = true;

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col border-r border-[color:var(--border)] bg-slate-950">
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
          const isActive = pathname === item.href && (item.id === 'tasks' || item.href !== '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={[
                'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-[color:var(--highlight)] text-[color:var(--primary)] shadow-[0_0_18px_rgba(34,211,238,0.12)]'
                  : 'text-[color:var(--foreground)] hover:bg-[color:var(--surface)]',
              ].join(' ')}
            >
              <PixelIcon
                name={item.icon}
                size={14}
                color={isActive ? 'var(--primary)' : 'var(--muted)'}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.original && (
                <span className="text-[9px] mono opacity-30 leading-none">*</span>
              )}
              {item.empty && (
                <span className="text-[9px] mono opacity-40 leading-none">0</span>
              )}
            </Link>
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
