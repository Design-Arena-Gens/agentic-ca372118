'use client';

import clsx from 'clsx';
import {
  CalendarClock,
  GaugeCircle,
  LifeBuoy,
  ListChecks,
  PlugZap,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { useCallback } from 'react';

const navItems = [
  { label: 'Strategic Brief', icon: Rocket },
  { label: 'Planner', icon: CalendarClock, active: true },
  { label: 'Social Inbox', icon: LifeBuoy },
  { label: 'Asset Library', icon: Sparkles },
  { label: 'Automations', icon: PlugZap },
  { label: 'Team Tasks', icon: ListChecks },
  { label: 'Insights', icon: GaugeCircle },
];

interface NavRailProps {
  className?: string;
  onCloseMobile?: () => void;
  mobileVisible?: boolean;
}

export const NavRail = ({
  className,
  onCloseMobile,
  mobileVisible = false,
}: NavRailProps) => {
  const handleSelection = useCallback(() => {
    if (onCloseMobile) onCloseMobile();
  }, [onCloseMobile]);

  return (
    <aside
      className={clsx(
        'z-40 flex w-64 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-lg shadow-emerald-500/5 transition-all',
        mobileVisible ? 'fixed inset-y-0 start-0' : '',
        className,
      )}
    >
      <div className="flex items-center gap-3 px-6 pb-6 pt-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/40">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/30">
            Agentic Suite
          </p>
          <p className="text-lg font-semibold text-white/90">
            Social Control Room
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={handleSelection}
            className={clsx(
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition',
              item.active
                ? 'bg-white/5 text-white shadow-inner ring-1 ring-white/10'
                : 'text-white/60 hover:bg-white/5 hover:text-white',
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={1.6} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-white/5 p-4 text-xs text-white/40">
        <p>Automation Credits</p>
        <p className="mt-1 text-sm font-semibold text-white/80">
          42 of 60 remaining
        </p>
      </div>
    </aside>
  );
};

