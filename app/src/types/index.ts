export type Platform = 'instagram' | 'facebook' | 'pinterest';

export interface SocialAccount {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  avatarUrl: string;
  connected: boolean;
  audience: number;
  engagementRate: number;
  bestPostTime: string;
  categories: string[];
}

export interface CategoryTopic {
  id: string;
  category: string;
  label: string;
  description: string;
  seasonal?: boolean;
}

export interface ContentIdea {
  id: string;
  category: string;
  topic: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  callToAction: string;
  angle: string;
}

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published';

export interface ScheduledPost {
  id: string;
  title: string;
  accountIds: string[];
  category: string;
  topic: string;
  scheduledAt: string;
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  status: PostStatus;
  performance: {
    projectedReach: number;
    projectedClicks: number;
    projectedSaves: number;
  };
}

export interface EngagementSnapshot {
  accountId: string;
  date: string;
  impressions: number;
  comments: number;
  saves: number;
  shares: number;
  clickThroughRate: number;
}

