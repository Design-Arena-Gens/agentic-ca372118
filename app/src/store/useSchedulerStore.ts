'use client';

import { addMinutes, formatISO } from 'date-fns';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  categoryTopics,
  demoAccounts,
  engagementSnapshots,
  initialScheduledPosts,
} from '@/data/mockData';
import { generateContentIdea } from '@/lib/contentGenerator';
import type {
  CategoryTopic,
  ContentIdea,
  EngagementSnapshot,
  Platform,
  ScheduledPost,
  SocialAccount,
} from '@/types';

interface GenerationPayload {
  topicId: string;
  platforms: Platform[];
  preferredPublishTime?: string;
  brandVoice: string;
}

interface SchedulePayload {
  idea: ContentIdea;
  accountIds: string[];
  scheduledAt: string;
}

interface SchedulerState {
  accounts: SocialAccount[];
  topics: CategoryTopic[];
  snapshots: EngagementSnapshot[];
  scheduledPosts: ScheduledPost[];
  brandVoice: string;
  addAccount: (account: Omit<SocialAccount, 'id'>) => void;
  removeAccount: (accountId: string) => void;
  toggleConnection: (accountId: string) => void;
  generateIdea: (payload: GenerationPayload) => ContentIdea | undefined;
  schedulePost: (payload: SchedulePayload) => ScheduledPost;
  markPostStatus: (postId: string, status: ScheduledPost['status']) => void;
  reschedulePost: (postId: string, newDate: string) => void;
  setBrandVoice: (voice: string) => void;
}

const clampDateToFuture = (scheduledAt: string) => {
  const now = new Date();
  const target = new Date(scheduledAt);
  if (target.getTime() < now.getTime()) {
    return formatISO(addMinutes(now, 30));
  }
  return scheduledAt;
};

export const useSchedulerStore = create<SchedulerState>()(
  persist(
    (set, get) => ({
      accounts: demoAccounts,
      topics: categoryTopics,
      snapshots: engagementSnapshots,
      scheduledPosts: initialScheduledPosts,
      brandVoice:
        'slow-crafted specialty coffee brand voice, friendly mentor tone, community-first and sustainably-minded',
      addAccount: (account) =>
        set((state) => ({
          accounts: [
            ...state.accounts,
            { ...account, id: crypto.randomUUID(), connected: true },
          ],
        })),
      removeAccount: (accountId) =>
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== accountId),
          scheduledPosts: state.scheduledPosts.map((post) => ({
            ...post,
            accountIds: post.accountIds.filter((id) => id !== accountId),
          })),
        })),
      toggleConnection: (accountId) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId
              ? { ...account, connected: !account.connected }
              : account,
          ),
        })),
      generateIdea: ({ topicId, platforms, brandVoice }) => {
        const topic = get().topics.find((item) => item.id === topicId);
        if (!topic) return;
        return generateContentIdea(topic, platforms, brandVoice);
      },
      schedulePost: ({ idea, accountIds, scheduledAt }) => {
        const post: ScheduledPost = {
          id: crypto.randomUUID(),
          title: `${idea.topic} Boost`,
          accountIds,
          category: idea.category,
          topic: idea.topic,
          scheduledAt: clampDateToFuture(scheduledAt),
          caption: idea.caption,
          hashtags: idea.hashtags,
          imagePrompt: idea.imagePrompt,
          status: 'scheduled',
          performance: {
            projectedReach: 7200 + Math.floor(Math.random() * 6200),
            projectedClicks: 450 + Math.floor(Math.random() * 420),
            projectedSaves: 240 + Math.floor(Math.random() * 360),
          },
        };
        set((state) => ({
          scheduledPosts: [post, ...state.scheduledPosts].sort(
            (a, b) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime(),
          ),
        }));
        return post;
      },
      markPostStatus: (postId, status) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((post) =>
            post.id === postId ? { ...post, status } : post,
          ),
        })),
      reschedulePost: (postId, newDate) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts
            .map((post) =>
              post.id === postId
                ? { ...post, scheduledAt: clampDateToFuture(newDate) }
                : post,
            )
            .sort(
              (a, b) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime(),
            ),
        })),
      setBrandVoice: (voice) => set(() => ({ brandVoice: voice })),
    }),
    {
      name: 'scheduler-state-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        brandVoice: state.brandVoice,
        scheduledPosts: state.scheduledPosts,
      }),
    },
  ),
);
