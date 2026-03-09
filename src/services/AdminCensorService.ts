import { type CensorLog, type Story } from "../interfaces/Story";
import { instance as axios } from "../lib/axios";
import { type Chapter } from "./AdminChapterCensorService";

export const AdminCensorService = {
  getPendingStories: async (): Promise<Story[]> => {
    const response = await axios.get("/admin/stories/pending");
    return response.data.data;
  },

  getManagedStories: async (): Promise<Story[]> => {
    const response = await axios.get("/admin/stories/managed");
    return response.data.data;
  },

  approveStory: async (id: string): Promise<Story> => {
    const response = await axios.post(`/admin/stories/${id}/approve`);
    return response.data.data;
  },

  rejectStory: async (id: string, reason: string): Promise<Story> => {
    const response = await axios.post(`/admin/stories/${id}/reject`, {
      reason,
    });
    return response.data.data;
  },

  banStory: async (id: string, reason: string): Promise<Story> => {
    const response = await axios.post(`/admin/stories/${id}/ban`, { reason });
    return response.data.data;
  },

  unbanStory: async (id: string): Promise<Story> => {
    const response = await axios.post(`/admin/stories/${id}/unban`);
    return response.data.data;
  },

  getStoryCensorLog: async (id: string): Promise<CensorLog[]> => {
    const response = await axios.get(`/admin/stories/${id}/logs`);
    return response.data.data;
  },

  getStoryChapters: async (id: string): Promise<Chapter[]> => {
    const response = await axios.get(`/admin/stories/${id}/chapters`);
    return response.data.data;
  },
};
