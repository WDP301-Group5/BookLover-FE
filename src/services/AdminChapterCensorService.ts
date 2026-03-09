import type { CensorLog } from "../interfaces/Story";
import { instance as axios } from "../lib/axios";

// Mở rộng interface Story cho các phần cần thiết
export interface Chapter {
  _id: string;
  storyId: string | any;
  chapterNumber: number;
  title: string;
  contentURL: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminChapterCensorService = {
  getPendingChapters: async (): Promise<Chapter[]> => {
    const response = await axios.get("/admin/chapters/pending");
    return response.data.data;
  },

  getManagedChapters: async (): Promise<Chapter[]> => {
    const response = await axios.get("/admin/chapters/managed");
    return response.data.data;
  },

  approveChapter: async (id: string): Promise<Chapter> => {
    const response = await axios.post(`/admin/chapters/${id}/approve`);
    return response.data.data;
  },

  rejectChapter: async (id: string, reason: string): Promise<Chapter> => {
    const response = await axios.post(`/admin/chapters/${id}/reject`, {
      reason,
    });
    return response.data.data;
  },

  banChapter: async (id: string, reason: string): Promise<Chapter> => {
    const response = await axios.post(`/admin/chapters/${id}/ban`, { reason });
    return response.data.data;
  },

  unbanChapter: async (id: string): Promise<Chapter> => {
    const response = await axios.post(`/admin/chapters/${id}/unban`);
    return response.data.data;
  },

  getChapterCensorLog: async (id: string): Promise<CensorLog[]> => {
    const response = await axios.get(`/admin/chapters/${id}/logs`);
    return response.data.data;
  },
};
