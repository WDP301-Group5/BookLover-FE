// src/interfaces/Story.ts
export interface Story {
  _id: string;
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
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoryItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  views: number;
  chapterNumber: number;
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
