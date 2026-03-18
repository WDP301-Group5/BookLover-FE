import type { ReactTypeValue } from "./ReactComment";

export interface IForum {
  id: number;
  name: string;
  slug: string;
  key: string;
  description: string;
  categoryCount?: number;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export interface IForumCategory {
  _id: string;
  id: string;
  forumId: string;
  author: {
    id: string;
    nickName: string;
    avatarURL: string;
  };
  type: "story" | "sideline" | "question";
  storyId?: string;
  title: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  view: number;
  post: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IForumPost {
  _id: string;
  id: string;
  userId: {
    _id: string;
    id: string;
    nickName: string;
    avatarURL: string;
  };
  react: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  replyCount: number;
  forumCategoryId: string;
  content: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ReactPost {
  _id: string;
  id: string;
  userId: string;
  forumPostId: string;
  forumCategoryId: string;
  react: ReactTypeValue;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReply {
  id: string;
  _id: string;
  userId: {
    id: string;
    _id: string;
    nickName: string;
    avatarURL: string;
  }
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
