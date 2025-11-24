'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { ArrowUpRight, BarChart3, LineChart, Trophy } from 'lucide-react';
import { useMemo } from 'react';

import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { useSchedulerStore } from '@/store/useSchedulerStore';

export const AnalyticsPanel = () => {
  const { snapshots, scheduledPosts, accounts } = useSchedulerStore();

  const metricsByAccount = useMemo(() => {
    return snapshots.reduce<Record<string, { reach: number; saves: number; shares: number; ctr: number }>>(
      (acc, snapshot) => {
        acc[snapshot.accountId] = {
          reach: snapshot.impressions,
          saves: snapshot.saves,
          shares: snapshot.shares,
          ctr: snapshot.clickThroughRate,
        };
        return acc;
      },
      {},
    );
  }, [snapshots]);

  const topPost = useMemo(() => {
    return [...scheduledPosts]
      .filter((post) => post.status === 'scheduled')
      .sort(
        (a, b) =>
          b.performance.projectedReach * b.performance.projectedClicks -
          a.performance.projectedReach * a.performance.projectedClicks,
      )[0];
  }, [scheduledPosts]);

  return (
    <section className="space-y-6 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 text-white">
      <header className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-emerald-300" />
        <div>
          <h3 className="text-lg font-semibold text-white/90">
            Engagement intelligence
          </h3>
          <p className="text-sm text-white/50">
            Track momentum of multi-channel campaigns and surface next-best-actions
            for the team.
          </p>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => {
          const metrics = metricsByAccount[account.id];
          if (!metrics) return null;
          return (
            <div
              key={account.id}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/80">{account.name}</p>
                  <p className="text-xs text-white/40">{account.handle}</p>
                </div>
                <PlatformIcon platform={account.platform} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Reach</p>
                  <p className="text-lg font-semibold text-white/80">
                    {metrics.reach.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-300">+6.4% vs last week</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">CTR</p>
                  <p className="text-lg font-semibold text-white/80">
                    {metrics.ctr.toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-emerald-300">+0.8% trending</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Saves</p>
                  <p className="text-lg font-semibold text-white/80">
                    {metrics.saves.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-300">Intent score high</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-white/40">Shares</p>
                  <p className="text-lg font-semibold text-white/80">
                    {metrics.shares.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-emerald-300">
                    +14 spark moments detected
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {topPost && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Trophy className="h-6 w-6 text-emerald-200" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                Highest predicted lift
              </p>
              <p className="text-sm font-semibold text-emerald-50">
                {topPost.topic} — {topPost.category}
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {Math.round(topPost.performance.projectedReach / 1000)}k reach
            </div>
          </div>
          <p className="mt-3 text-sm text-emerald-100 line-clamp-2">
            {topPost.caption}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-emerald-100/80">
            <span>
              Publishes{' '}
              {formatDistanceToNow(parseISO(topPost.scheduledAt), {
                addSuffix: true,
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Viral ready score 92
            </span>
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              CTA conversions +18% predicted
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

