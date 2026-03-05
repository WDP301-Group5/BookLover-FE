// src/services/StoryPageService.ts
import { instance } from "../lib/axios";
import type { Story, StoryItem } from "../interfaces/Story";

export const StoryPageService = {

  async getStories(): Promise<StoryItem[]> {
    const res = await instance.get<Story[]>("/story");
    console.log(res.data);
    return res.data.map((s) => {
      return{
      id: s.id,
      title: s.title,
      slug: s.slug,
      image: s.image,
      views: s.views,
      chapterNumber: s.chapters ?? 0,
    }});
  },

  async getStoryBySlug(slug: string): Promise<Story> {
    const res = await instance.get(`/story/${slug}`);
    res.data.topics = res.data.topics.map((topic: { name: string }) => {
      return topic?.name || "";
    });
    return res.data as Story;
  },
};
