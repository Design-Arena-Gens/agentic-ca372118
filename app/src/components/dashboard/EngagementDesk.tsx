'use client';

import Image from 'next/image';
import { formatDistanceToNow, subMinutes } from 'date-fns';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import {
  HeartHandshake,
  MessageCircleHeart,
  Reply,
  SendHorizonal,
  Tag,
} from 'lucide-react';

const engagementQueue = [
  {
    id: 'thread-1',
    author: 'Maya | Latte Lover',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=96&q=80',
    snippet:
      "Your lavender honey flat white preview looks unreal! Will it be gluten-free?",
    postedAt: subMinutes(new Date(), 24),
    channel: 'Instagram DM',
    sentiment: 'positive',
    status: 'Awaiting reply',
    action: 'Send product allergen info template',
  },
  {
    id: 'thread-2',
    author: 'Trevor @ City Eats',
    avatar:
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=96&q=80',
    snippet:
      'We featured your roastery reel in tomorrow’s newsletter. Want the PDF proof?',
    postedAt: subMinutes(new Date(), 48),
    channel: 'Facebook Comment',
    sentiment: 'neutral',
    status: 'Team follow-up needed',
    action: 'Assign to PR workflow',
  },
  {
    id: 'thread-3',
    author: 'Pinterest Tastemakers',
    avatar:
      'https://images.unsplash.com/photo-1521579771721-1c1c4c6f0bf0?auto=format&fit=crop&w=96&q=80',
    snippet:
      'Cold brew mocktails board is trending! Any chance of a co-branded idea pin?',
    postedAt: subMinutes(new Date(), 87),
    channel: 'Pinterest Message',
    sentiment: 'positive',
    status: 'Queued for response',
    action: 'Share partnership deck link',
  },
];

export const EngagementDesk = () => {
  return (
    <section className="rounded-3xl border border-white/5 bg-slate-950/70 p-6 text-white">
      <header className="flex items-center gap-3">
        <MessageCircleHeart className="h-6 w-6 text-emerald-300" />
        <div>
          <h3 className="text-lg font-semibold text-white/90">
            Engagement desk
          </h3>
          <p className="text-sm text-white/50">
            Consolidated comments, DMs, and collaboration invites sorted by
            response priority.
          </p>
        </div>
      </header>
      <div className="mt-4 space-y-3">
        {engagementQueue.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center"
          >
            <div className="flex flex-1 items-center gap-3">
              <Image
                src={item.avatar}
                alt={item.author}
                className="h-12 w-12 rounded-full object-cover"
                width={48}
                height={48}
              />
              <div>
                <p className="text-sm font-semibold text-white/80">{item.author}</p>
                <p className="text-xs text-white/40">{item.channel}</p>
              </div>
            </div>
            <p className="flex-[2] text-sm text-white/60">{item.snippet}</p>
            <div className="flex flex-1 flex-col gap-2 text-xs text-white/50">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <ChatBubbleIcon className="h-4 w-4" />
                {item.status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-emerald-200">
                <HeartHandshake className="h-4 w-4" />
                {item.action}
              </span>
              <span>
                {formatDistanceToNow(item.postedAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-50">
                <Reply className="h-4 w-4" />
                Reply with template
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white">
                <Tag className="h-4 w-4" />
                Assign teammate
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 transition hover:border-white/30 hover:text-white">
                <SendHorizonal className="h-4 w-4" />
                Mark handled
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
