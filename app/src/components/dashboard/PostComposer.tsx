'use client';

import Image from 'next/image';
import {
  CalendarDays,
  Loader2,
  MousePointerClick,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatISO } from 'date-fns';

import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { useSchedulerStore } from '@/store/useSchedulerStore';
import type { ContentIdea, Platform } from '@/types';

const defaultDateTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 2);
  date.setMinutes(0);
  return formatISO(date).slice(0, 16);
};

export const PostComposer = () => {
  const {
    accounts,
    topics,
    generateIdea,
    schedulePost,
    brandVoice,
    setBrandVoice,
  } = useSchedulerStore();

  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.id ?? '');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    accounts.slice(0, 2).map((account) => account.id),
  );
  const [scheduledAt, setScheduledAt] = useState(defaultDateTime);
  const [idea, setIdea] = useState<ContentIdea | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const selectedPlatforms = useMemo(
    () =>
      Array.from(
        new Set(
          accounts
            .filter((account) => selectedAccounts.includes(account.id))
            .map((account) => account.platform),
        ),
      ) as Platform[],
    [accounts, selectedAccounts],
  );

  const availableTopicsByCategory = useMemo(() => {
    const map = new Map<string, typeof topics>();
    topics.forEach((topic) => {
      if (!map.has(topic.category)) {
        map.set(topic.category, []);
      }
      map.get(topic.category)!.push(topic);
    });
    return map;
  }, [topics]);

  const selectedTopicObj = topics.find((topic) => topic.id === selectedTopic);

  const handleGenerate = async () => {
    if (!selectedTopic || selectedPlatforms.length === 0) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newIdea = generateIdea({
      topicId: selectedTopic,
      platforms: selectedPlatforms,
      brandVoice,
    });
    setIdea(newIdea);
    setIsGenerating(false);
  };

  const handleSchedule = async () => {
    if (!idea) return;
    setIsScheduling(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    schedulePost({
      idea,
      accountIds: selectedAccounts,
      scheduledAt,
    });
    setIdea(undefined);
    setIsScheduling(false);
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 p-6 text-white shadow-2xl shadow-emerald-500/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white/90">
            Auto-generate a cross-platform post
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Blend brand voice, trending touchpoints, and the perfect posting
            windows for every connected network.
          </p>
        </div>
        <Sparkles className="h-8 w-8 text-emerald-400" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 rounded-3xl border border-white/5 bg-white/5/10 p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">
            Connected Accounts
          </p>
          <div className="space-y-3">
            {accounts.map((account) => {
              const selected = selectedAccounts.includes(account.id);
              return (
                <button
                  key={account.id}
                  onClick={() =>
                    setSelectedAccounts((prev) =>
                      selected
                        ? prev.filter((id) => id !== account.id)
                        : [...prev, account.id],
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                    selected
                      ? 'border-emerald-400/60 bg-emerald-400/10 text-white'
                      : 'border-white/5 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Image
                    src={account.avatarUrl}
                    alt={account.name}
                    className="h-10 w-10 rounded-2xl object-cover"
                    width={40}
                    height={40}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{account.name}</p>
                    <p className="text-xs text-white/40">{account.handle}</p>
                  </div>
                  <PlatformIcon platform={account.platform} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border border-white/5 bg-white/5/10 p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">
            Campaign Blueprint
          </p>
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/60">Category</span>
              <select
                value={
                  selectedTopicObj?.category ??
                  topics[0]?.category ??
                  'Product Highlights'
                }
                onChange={(event) => {
                  const category = event.target.value;
                  const firstTopic = availableTopicsByCategory.get(category)?.[0];
                  if (firstTopic) {
                    setSelectedTopic(firstTopic.id);
                  }
                }}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-white/80 focus:border-emerald-400 focus:outline-none"
              >
                {Array.from(availableTopicsByCategory.keys()).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/60">Topic</span>
              <select
                value={selectedTopic}
                onChange={(event) => setSelectedTopic(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-white/80 focus:border-emerald-400 focus:outline-none"
              >
                {availableTopicsByCategory
                  .get(selectedTopicObj?.category ?? topics[0]?.category ?? '')
                  ?.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/60">Brand Voice</span>
              <textarea
                value={brandVoice}
                onChange={(event) => setBrandVoice(event.target.value)}
                rows={3}
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white/80 focus:border-emerald-400 focus:outline-none"
              />
            </label>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Brewing content intelligence…
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Generate content system prompt
                </>
              )}
            </button>
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border border-white/5 bg-white/5/10 p-5">
          <p className="text-xs uppercase tracking-wide text-white/40">
            Scheduling
          </p>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-white/60">Publish at</span>
            <div className="relative">
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 pe-10 text-white/80 focus:border-emerald-400 focus:outline-none"
              />
              <CalendarDays className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            </div>
          </label>
          <div className="space-y-4 text-sm text-white/60">
            <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5/40 px-4 py-3 text-white/70">
              <span>Platform sync</span>
              <span className="text-emerald-300">
                {selectedPlatforms.length} networks
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.map((platform) => (
                <PlatformIcon key={platform} platform={platform} showLabel />
              ))}
            </div>
            <button
              disabled={!idea || isScheduling}
              onClick={handleSchedule}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Locking in optimal slots…
                </>
              ) : (
                <>
                  <MousePointerClick className="h-4 w-4" />
                  Schedule post cadence
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {idea && (
        <div className="mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                Generated Content Blueprint
              </p>
              <h3 className="mt-1 text-lg font-semibold text-emerald-100">
                {idea.topic}
              </h3>
            </div>
            <span className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {idea.category}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100">
            {idea.caption}
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide text-emerald-300">
            Viral Hashtag Stack
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-emerald-100">
            {idea.hashtags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs uppercase tracking-wide text-emerald-300/70">
            Image Intelligence Prompt
          </p>
          <p className="mt-1 text-sm text-emerald-100">{idea.imagePrompt}</p>
        </div>
      )}
    </div>
  );
};
