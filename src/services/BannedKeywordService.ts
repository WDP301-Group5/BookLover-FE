import { instance as axios } from "../lib/axios";

export interface BannedKeyword {
  _id: string;
  text: string;
  category: "profanity" | "political" | "spam" | "violence" | "sexual" | "other";
  severity: "critical" | "medium" | "low";
  isRegex: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const BannedKeywordService = {
  getAll: async (): Promise<BannedKeyword[]> => {
    const response = await axios.get("/admin/banned-keywords");
    return response.data.data;
  },

  getById: async (id: string): Promise<BannedKeyword> => {
    const response = await axios.get(`/admin/banned-keywords/${id}`);
    return response.data.data;
  },

  create: async (data: {
    text: string;
    category: string;
    severity?: string;
    isRegex?: boolean;
  }): Promise<BannedKeyword> => {
    const response = await axios.post("/admin/banned-keywords", data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: Partial<{
      text: string;
      category: string;
      severity: string;
      isRegex: boolean;
      isActive: boolean;
    }>
  ): Promise<BannedKeyword> => {
    const response = await axios.put(`/admin/banned-keywords/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string, hard?: boolean): Promise<void> => {
    const url = hard ? `/admin/banned-keywords/${id}?hard=true` : `/admin/banned-keywords/${id}`;
    const response = await axios.delete(url);
    return response.data.data;
  },
};
