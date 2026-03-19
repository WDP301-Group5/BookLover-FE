// src/interfaces/Chapter.ts

export interface Chapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  isPremium: boolean;
  price: number;
  contentURL?: string;
  status?:
    | "draft"
    | "active"
    | "inactive"
    | "error"
    | "pending"
    | "rejected"
    | "banned"
    | "private";
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChapterItem {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  isPremium?: boolean;
  price?: number;
  updatedAt?: string;
  views?: number;
}
