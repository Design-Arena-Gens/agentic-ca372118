'use client';

import clsx from 'clsx';
import type { PostStatus } from '@/types';

const statusTheme: Record<PostStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border border-slate-200',
  scheduled: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  publishing: 'bg-amber-50 text-amber-600 border border-amber-100',
  published: 'bg-blue-50 text-blue-600 border border-blue-100',
};

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      statusTheme[status],
      className,
    )}
  >
    <span className="h-2 w-2 rounded-full bg-current" />
    {status}
  </span>
);

