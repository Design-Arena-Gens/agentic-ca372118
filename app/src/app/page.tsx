'use client';

import { AppWindow, Compass, Sparkles, TrendingUp } from 'lucide-react';

import { AccountManager } from '@/components/dashboard/AccountManager';
import { AnalyticsPanel } from '@/components/dashboard/AnalyticsPanel';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { EngagementDesk } from '@/components/dashboard/EngagementDesk';
import { PostComposer } from '@/components/dashboard/PostComposer';
import { AppShell } from '@/components/layout/AppShell';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { useSchedulerStore } from '@/store/useSchedulerStore';

export default function Home() {
  const accounts = useSchedulerStore((state) => state.accounts);

  return (
    <AppShell>
      <div className="relative z-0 flex flex-col gap-6 p-6 lg:p-8">
        <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/90 via-slate-950 to-black p-6 text-white shadow-[0_50px_100px_-40px_rgba(14,116,144,0.6)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  <Sparkles className="h-4 w-4" />
                  Agentic automation briefing
                </span>
                <h1 className="text-3xl font-semibold text-white/90">
                  Orchestrate Instagram, Facebook, and Pinterest content in one control
                  room.
                </h1>
                <p className="text-sm text-white/60">
                  Generate on-brand stories, sync viral hashtag stacks, and lock in
                  high-performing scheduling windows across your connected accounts —
                  no tab switching required.
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-white/40">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <Compass className="h-4 w-4 text-emerald-300" />
                    Predictive timing engine
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <TrendingUp className="h-4 w-4 text-sky-300" />
                    Engagement lift recommendations
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <AppWindow className="h-4 w-4 text-amber-300" />
                    Multi-account routing
                  </span>
                </div>
              </div>
              <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 lg:w-72">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Connected network stack
                </p>
                <div className="space-y-2">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white/80">{account.name}</p>
                        <p className="text-xs text-white/40">{account.handle}</p>
                      </div>
                      <PlatformIcon platform={account.platform} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-slate-950/70 p-6">
            <p className="text-xs uppercase tracking-wide text-white/40">
              Automation health
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm text-white/60">
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <span>Upcoming auto-publish</span>
                <span className="text-emerald-300">3 posts within 48h</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <span>Creative slots remaining</span>
                <span className="text-sky-300">27 daily tokens</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                <span>Engagement inbox</span>
                <span className="text-amber-300">3 priority threads</span>
              </div>
            </div>
          </div>
        </section>

        <PostComposer />

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <CalendarView />
          <div className="space-y-6">
            <AccountManager />
            <AnalyticsPanel />
          </div>
        </section>

        <EngagementDesk />
      </div>
    </AppShell>
  );
}
