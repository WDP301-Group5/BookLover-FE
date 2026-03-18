import { instance as axios } from "../lib/axios";

export const AdminTransactionService = {
  getAll: async (params: {
    page: number;
    limit: number;
    keyword?: string;
    status?: string;
  }) => {
    const response = await axios.get("/admin/transactions", {
      params,
    });
    return response.data;
  },

  updateStatus: async (
    transactionId: string,
    status: "success" | "failed" | "pending"
  ) => {
    const response = await axios.patch("/admin/transactions/status", {
      transactionId,
      status,
    });
    return response.data;
  },

  getRevenueReport: async (dateRange: "today" | "month" | "year") => {
    const response = await axios.get("/admin/transactions/revenue-report", {
      params: { dateRange },
    });
    return response.data;
  },
};