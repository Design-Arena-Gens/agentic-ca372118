'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { Menu, Rows3 } from 'lucide-react';
import { useState } from 'react';
import { NavRail } from './NavRail';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-950">
      <NavRail
        className={clsx(
          'hidden border-r border-white/5 lg:flex',
          mobileOpen && 'flex',
        )}
        onCloseMobile={() => setMobileOpen(false)}
        mobileVisible={mobileOpen}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-white/5 px-6 py-4 text-white">
          <button
            className="rounded-lg border border-white/10 p-2 hover:border-white/30 lg:hidden"
            onClick={() => setMobileOpen((state) => !state)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
            <Rows3 className="h-4 w-4" />
            Agentic Social OS
          </span>
          <div className="ms-auto flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Auto-publishing active
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs leading-tight text-white/40">
                <p>Urban Bean Ops</p>
                <p className="font-medium text-white/80">Operations Team</p>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=96&q=80"
                alt="Team avatar"
                className="h-10 w-10 rounded-full border border-white/10 object-cover"
                width={40}
                height={40}
              />
            </div>
          </div>
        </header>
        <main className="relative flex-1 overflow-x-hidden bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};
