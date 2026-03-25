// src/interfaces/Story.ts
import type { AIAnalysis } from "./AIAnalysis";

export interface Story {
  _id: string;
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  authorId: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    fullName: string;
  };
  topics: string[];
  tags: string[];
  status: "draft" | "pending" | "active" | "rejected" | "private" | "banned";
  isPremium: boolean;
  isFinish: boolean;
  views: number;
  stars: number;
  rates: number;
  chapters?: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
  author?: StoryAuthor | null;
  // AI Analysis fields (added when fetching with AI analysis enabled)
  aiAnalysis?: AIAnalysis;
  aiDecision?: "safe" | "review" | "risky";
}

export interface StoryItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  views: number;
  chapterNumber: number;
  storyId?: {
    id: string;
    slug: string;
    image: string;
    title: string;
  };
}

export interface CensorLog {
  _id: string;
  storyId: string;
  adminId: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    fullName: string;
  };
  action: "approve" | "reject" | "ban" | "unban";
  reason?: string;
  createdAt: string;
}

export interface StoryAuthor {
  id: string;
  fullName?: string;
  nickName?: string;
  penName?: string;
  username?: string;
  avatarURL?: string;
}
