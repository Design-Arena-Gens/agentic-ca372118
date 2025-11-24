'use client';

import { Facebook, Instagram, Pin } from 'lucide-react';
import type { Platform } from '@/types';
import clsx from 'clsx';

const platformConfig: Record<
  Platform,
  { label: string; colors: string; Icon: typeof Instagram }
> = {
  instagram: {
    label: 'Instagram',
    colors:
      'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-inner',
    Icon: Instagram,
  },
  facebook: {
    label: 'Facebook',
    colors: 'bg-blue-600 text-white shadow-inner',
    Icon: Facebook,
  },
  pinterest: {
    label: 'Pinterest',
    colors: 'bg-red-600 text-white shadow-inner',
    Icon: Pin,
  },
};

interface PlatformIconProps {
  platform: Platform;
  className?: string;
  showLabel?: boolean;
}

export const PlatformIcon = ({
  platform,
  className,
  showLabel = false,
}: PlatformIconProps) => {
  const config = platformConfig[platform];
  const Icon = config.Icon;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        config.colors,
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={showLabel ? 1.5 : 2} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
