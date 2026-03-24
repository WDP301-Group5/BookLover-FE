export const ReactType = {
  UNLIKE: "unlike", // tức là đã react nhưng lại bỏ react
  LIKE: "like",
  LOVE: "love",
  HAHA: "haha",
  WOW: "wow",
  SAD: "sad",
  ANGRY: "angry",
} as const;

export type ReactTypeValue = (typeof ReactType)[keyof typeof ReactType];


export interface ReactComment {
  id: string;
  userId: string;
  commentId: string;
  chapterId: string;
  react: ReactTypeValue;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReact {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}
