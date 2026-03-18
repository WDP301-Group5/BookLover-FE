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

  updateChapter: async (id: string, formData: FormData): Promise<Chapter> => {
    const response = await axios.put(`/chapter/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getChaptersByStory: async (storyId: string): Promise<Chapter[]> => {
    const response = await axios.get(`/chapter/story/${storyId}`);
    return response.data;
  },

  getChaptersByStoryForAuthor: async (storyId: string): Promise<Chapter[]> => {
    const response = await axios.get(`/chapter/author/story/${storyId}`);
    return response.data;
  },

  getChapterById: async (id: string): Promise<Chapter> => {
    const response = await axios.get(`/chapter/${id}`);
    return response.data;
  },

  publishStoryChapters: async (
    storyId: string,
  ): Promise<{ modifiedCount: number }> => {
    const response = await axios.put(`/chapter/publish/${storyId}`);
    return response.data;
  },

  updateStory: async (id: string, data: Partial<Story>): Promise<Story> => {
    const response = await axios.put(`/story/${id}`, data);
    return response.data;
  },

  updateStoryWithImage: async (
    id: string,
    formData: FormData,
  ): Promise<Story> => {
    const response = await axios.put(`/story/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteStory: async (id: string): Promise<void> => {
    await axios.delete(`/story/${id}`);
  },

  deleteChapter: async (id: string): Promise<void> => {
    await axios.delete(`/chapter/${id}`);
  },

  submitChapterForReview: async (id: string): Promise<void> => {
    await axios.patch(`/chapter/${id}/review`);
  },
};
