import { instance as axios } from "../lib/axios";

export interface AIAnalysis {
  _id: string;
  chapterId: string;
  geminiDecision?: {
    decision: "APPROVE" | "FLAG" | "REJECT";
    scores: {
      toxicity: number;
      sexual: number;
      violence: number;
      political: number;
    };
    reasons: string[];
    warnings: string[];
  };
  finalDecision: "auto-approved" | "flagged" | "auto-rejected" | "hard-filter-rejected";
  reasons: string[];
  processedAt: string;
}

export interface Chapter {
  _id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  contentURL: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  aiAnalysis?: AIAnalysis | null;
}

export interface QueueStatus {
  pending: number;
  processing: number;
  failed: number;
}

export interface OverrideStats {
  total: number;
  byOriginalDecision: Record<string, number>;
  byOverrideType: Record<string, number>;
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

  overrideDecision: async (
    id: string,
    decision: "active" | "rejected",
    reason: string
  ): Promise<void> => {
    const response = await axios.post(`/admin/chapters/${id}/override`, {
      decision,
      reason,
    });
    return response.data.data;
  },

  getQueueStatus: async (): Promise<QueueStatus> => {
    const response = await axios.get("/admin/chapters/queue/status");
    return response.data.data;
  },

  retryFailedJobs: async (): Promise<number> => {
    const response = await axios.post("/admin/chapters/queue/retry");
    return response.data.data.count;
  },

  getOverrideStatistics: async (): Promise<OverrideStats> => {
    const response = await axios.get("/admin/chapters/statistics/overrides");
    return response.data.data;
  },

  triggerAIAnalysis: async (id: string): Promise<void> => {
    const response = await axios.post(`/admin/chapters/${id}/trigger-ai`);
    return response.data.data;
  },
};
