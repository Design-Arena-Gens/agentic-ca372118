'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Cable,
  Link2,
  Plus,
  Signal,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { useSchedulerStore } from '@/store/useSchedulerStore';
import type { Platform } from '@/types';

const defaultPlatform: Platform = 'instagram';

export const AccountManager = () => {
  const { accounts, addAccount, toggleConnection } = useSchedulerStore();
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');

  const handleAddAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!handle || !name) return;
    addAccount({
      name,
      handle,
      platform,
      avatarUrl:
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=200&q=80',
      audience: 9500,
      engagementRate: 2.9,
      bestPostTime: '09:30',
      categories: ['Product Highlights'],
      connected: true,
    });
    setHandle('');
    setName('');
    setPlatform(defaultPlatform);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-white/5 bg-slate-950/60 p-6 text-white">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white/90">
            Multi-platform account control
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Manage connected profiles, keep authentication fresh, and activate
            automations per channel.
          </p>
        </div>
        <Cable className="h-6 w-6 text-emerald-300" />
      </header>
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
          >
            <Image
              src={account.avatarUrl}
              alt={account.name}
              className="h-12 w-12 rounded-2xl object-cover"
              width={48}
              height={48}
            />
            <div className="flex min-w-[160px] flex-col">
              <span className="text-sm font-semibold text-white/80">
                {account.name}
              </span>
              <span className="text-xs text-white/40">{account.handle}</span>
            </div>
            <PlatformIcon platform={account.platform} showLabel />
            <div className="ms-auto flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                {account.audience.toLocaleString()} followers
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                {account.engagementRate}% engagement
              </span>
              <button
                onClick={() => toggleConnection(account.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:border-emerald-400/50 hover:text-emerald-200"
              >
                {account.connected ? (
                  <>
                    <ToggleRight className="h-4 w-4 text-emerald-300" />
                    Connected
                  </>
                ) : (
                  <>
                    <ToggleLeft className="h-4 w-4 text-white/30" />
                    Reconnect
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4"
        onSubmit={handleAddAccount}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Plus className="h-5 w-5 text-emerald-300" />
          <p className="text-sm font-semibold text-white/70">
            Connect another profile
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/50">Platform</span>
            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value as Platform)}
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white/80 focus:border-emerald-400 focus:outline-none"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/50">Page name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Urban Bean Downtown"
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white/80 focus:border-emerald-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/50">Handle</span>
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="@urbanbeandowntown"
              className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white/80 focus:border-emerald-400 focus:outline-none"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-50"
        >
          <Link2 className="h-4 w-4" />
          Connect profile
        </button>
        <p className="mt-2 text-xs text-white/40">
          Connections sync daily to refresh tokens and confirm scheduling
          permissions per platform.
        </p>
      </form>
      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <Signal className="h-4 w-4 text-emerald-300" />
          Publishing reliability SLA 99.7%
        </div>
        <p>Next API token rotation in 12 hours</p>
      </div>
    </section>
  );
};
