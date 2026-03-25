import type { AIAnalysis } from "../interfaces/AIAnalysis";
import { type CensorLog, type Story } from "../interfaces/Story";
import { instance as axios } from "../lib/axios";
import { type Chapter } from "./AdminChapterCensorService";

export const AdminCensorService = {
  /**
   * Get pending stories with optional AI analysis
   * @param runAIAnalysis - If true, runs AI analysis on stories that don't have one
   */
  getPendingStories: async (
    runAIAnalysis: boolean = false,
  ): Promise<Story[]> => {
    const response = await axios.get("/admin/stories/pending", {
      params: { ai: runAIAnalysis },
    });
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

  /**
   * Run AI analysis on a specific story
   */
  analyzeStory: async (
    id: string,
  ): Promise<{
    story: Story;
    analysis: AIAnalysis & { error?: string };
  }> => {
    const response = await axios.post(`/admin/stories/${id}/analyze`);
    return response.data.data;
  },

  /**
   * Get AI analysis for a specific story
   */
  getStoryAIAnalysis: async (id: string): Promise<AIAnalysis | null> => {
    const response = await axios.get(`/admin/stories/${id}/ai-analysis`);
    return response.data.data;
  },
};
