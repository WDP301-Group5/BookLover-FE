import { instance as axios } from "../lib/axios";
import type { Story } from "../interfaces/Story";
import type { Chapter } from "../interfaces/Chapter";

export const AuthorService = {
  createStory: async (formData: FormData): Promise<Story> => {
    const response = await axios.post("/story", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getMyStories: async (): Promise<Story[]> => {
    const response = await axios.get("/story/my-stories");
    return response.data;
  },

  getStoryBySlug: async (slug: string): Promise<Story> => {
    const response = await axios.get(`/story/${slug}`);
    return response.data;
  },

  createChapter: async (formData: FormData): Promise<Chapter> => {
    const response = await axios.post("/chapter", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getChaptersByStory: async (storyId: string): Promise<Chapter[]> => {
    const response = await axios.get(`/chapter/story/${storyId}`);
    return response.data;
  },
};
