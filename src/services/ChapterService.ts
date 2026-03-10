// src/services/ChapterPageService.ts

import type { Chapter, ChapterItem } from "../interfaces/Chapter";
import { instance } from "../lib/axios";

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

  async createChapter(data: FormData): Promise<Chapter> {
    const res = await instance.post("/chapter", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  async getChapterByChapterNumber(
    storySlug: string,
    chapterNumber: number,
  ): Promise<Chapter> {
    const res = await instance.get<Chapter>(
      `/chapter/story/${storySlug}/chapter/${chapterNumber}`,
    );
    return res.data;
  },

  async userReadChapter(storyId: string, chapterNumber: number) {
    if (!storyId || !chapterNumber) return null;
    const res = await instance.post(`/story/read/${storyId}`, {
      chapterNumber,
    });
    return res.data;
  },

  async buyChapter(chapterId: string, currentStone: number) {
    if (!chapterId || !currentStone || !Number(currentStone)) return null;
    const res = await instance.post(`/chapter/buy/${chapterId}`, {
      currentStone,
    });
    console.log("res", res)
    return res.data;
  },
};
