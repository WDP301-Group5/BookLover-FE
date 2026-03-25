import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StorySubTab = "views" | "followers";
export type AuthorSubTab = "followers" | "stories";
export type UserSubTab = "comments" | "spent";

export interface TopStoryCardData {
  rank: number;
  title: string;
  slug: string;
  coverUrl: string;
  author: string;
  categories: string[];
  views: number;
  followers: number;
  rates: number;
  chapters: number;
  description: string;
  isPremium: boolean;
}

export interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export interface RankStat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

export interface AdminRankCardProps {
  rank: number;
  avatar?: string;
  name?: string;
  username?: string;
  stats: RankStat[];
  extra?: ReactNode;
  onClick?: () => void;
}

export interface AdminStoryRowProps {
  story: TopStoryCardData;
  onClick?: () => void;
}