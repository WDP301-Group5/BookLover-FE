// src/services/ChapterPageService.ts
import { instance } from "../lib/axios";
import type { Chapter, ChapterItem } from "../interfaces/Chapter";

export const ChapterPageService = {

  async getChaptersByStory(storyId: string): Promise<ChapterItem[]> {
    const res = await instance.get<Chapter[]>(`/chapter/story/${storyId}`);
    return res.data.map((c) => ({
      id: c.id,
      storyId: c.storyId,
      chapterNumber: c.chapterNumber,
      title: c.title,
      updatedAt: c.updatedAt,
      views: c.views,
    }));
  },

  async getChapterById(id: string): Promise<Chapter> {
    const res = await instance.get<Chapter>(`/chapter/${id}`);
    return res.data;
  },
};
