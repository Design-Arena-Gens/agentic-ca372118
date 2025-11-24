'use client';

import Image from 'next/image';
import {
  addDays,
  eachDayOfInterval,
  format,
  formatISO,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import {
  AlarmClock,
  ArrowRight,
  Check,
  Clock,
  Flame,
  PlayCircle,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { StatusBadge } from '@/components/ui/StatusBadge';
import { useSchedulerStore } from '@/store/useSchedulerStore';
import type { ScheduledPost } from '@/types';

const getNextSevenDays = () => {
  const start = new Date();
  const end = addDays(start, 6);
  return eachDayOfInterval({ start, end });
};

const statusesPriority: Record<ScheduledPost['status'], number> = {
  scheduled: 1,
  publishing: 2,
  draft: 0,
  published: 3,
};

export const CalendarView = () => {
  const { scheduledPosts, accounts, markPostStatus, reschedulePost } =
    useSchedulerStore();
  const [highlightedDay, setHighlightedDay] = useState<string | null>(null);

  const days = useMemo(() => getNextSevenDays(), []);

  const postsByDay = useMemo(() => {
    return days.map((day) => ({
      day,
      isToday: isToday(day),
      formatted: format(day, 'EEEE, MMM d'),
      posts: scheduledPosts
        .filter((post) => isSameDay(parseISO(post.scheduledAt), day))
        .sort((a, b) => {
          const timeDiff =
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
          if (timeDiff !== 0) return timeDiff;
          return statusesPriority[a.status] - statusesPriority[b.status];
        }),
    }));
  }, [days, scheduledPosts]);

  const handleQuickPublish = async (postId: string) => {
    markPostStatus(postId, 'publishing');
    await new Promise((resolve) => setTimeout(resolve, 800));
    markPostStatus(postId, 'published');
  };

  const handleShift = (post: ScheduledPost, direction: 1 | -1) => {
    const current = parseISO(post.scheduledAt);
    const next = addDays(current, direction);
    const formatted = formatISO(next).slice(0, 16);
    reschedulePost(post.id, formatted);
    setHighlightedDay(format(next, 'yyyy-MM-dd'));
    setTimeout(() => setHighlightedDay(null), 2000);
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-white/5/5 p-6 text-white">
      <header className="flex flex-wrap items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white/90">
            Multi-network content calendar
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Drag-and-drop rescheduling, synchronized publishing windows, and live
            automation signals.
          </p>
        </div>
        <div className="ms-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
          <Flame className="h-4 w-4 text-amber-300" />
          Viral slot detection on
        </div>
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {postsByDay.map(({ day, formatted, posts, isToday: today }) => (
          <div
            key={formatted}
            className={`relative rounded-3xl border border-white/5 bg-slate-950/60 p-4 transition ${
              format(day, 'yyyy-MM-dd') === highlightedDay
                ? 'ring-2 ring-emerald-400/60'
                : ''
            }`}
          >
            {today && (
              <span className="absolute -top-3 left-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Today
              </span>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">
                  {format(day, 'MMM d')}
                </p>
                <p className="text-lg font-semibold text-white/80">{format(day, 'EEEE')}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                {posts.length} scheduled
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {posts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5/30 p-4 text-center text-sm text-white/40">
                  No content locked for this day yet. Drop in a new automation.
                </div>
              )}
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white/80">
                        {format(parseISO(post.scheduledAt), 'h:mm a')}
                      </p>
                      <p className="text-xs text-white/40">{post.topic}</p>
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="line-clamp-3 text-sm text-white/70">{post.caption}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                    {post.hashtags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/10 px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.accountIds.map((accountId) => {
                      const account = accounts.find((item) => item.id === accountId);
                      if (!account) return null;
                      return (
                        <div
                          key={accountId}
                          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"
                        >
                      <Image
                        src={account.avatarUrl}
                        alt={account.name}
                        className="h-7 w-7 rounded-lg object-cover"
                        width={28}
                        height={28}
                      />
                          <div className="text-left">
                            <p className="font-medium text-white/70">{account.platform}</p>
                            <p className="text-[11px]">{account.handle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleQuickPublish(post.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-50"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Auto-publish now
                    </button>
                    <button
                      onClick={() => handleShift(post, -1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/30 hover:text-white"
                    >
                      <Clock className="h-4 w-4" />
                      Shift -1 day
                    </button>
                    <button
                      onClick={() => handleShift(post, 1)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/30 hover:text-white"
                    >
                      <AlarmClock className="h-4 w-4" />
                      Shift +1 day
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-200" />
                      Viral probability
                    </div>
                    <div className="flex items-center gap-1 text-emerald-200">
                      <ArrowRight className="h-4 w-4" />
                      {Math.round(post.performance.projectedReach / 1000)}k reach
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-300" />
          Auto-sync enabled for Instagram + Facebook + Pinterest
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Prime posting window detection adjusts daily @ 07:00
        </div>
      </footer>
    </section>
  );
};
