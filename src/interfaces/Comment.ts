export interface Comment {
  id: string;
  user: {
    id: string;
    nickName: string;
    avatarURL: string;
  };
  chapterId: string;
  content: string;
  replyCount: number;
  replyOf: string;
  react: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  status: "active" | "deleted" | "spam" | "blocked";
  createdAt: string;
  updatedAt: string;
}
