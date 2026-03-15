import type {
  Report,
  ReportLog,
  GetReportsParams,
  GetReportsResponse,
} from "../interfaces/report";
import { instance as axios } from "../lib/axios";

export const AdminReportService = {
  /**
   * Get list of reports with filters and pagination
   */
  async getReports(params: GetReportsParams): Promise<GetReportsResponse> {
    const response = await axios.get("/admin/reports", { params });
    return response.data.data;
  },

  /**
   * Get report detail by ID
   */
  async getReport(id: string): Promise<Report> {
    const response = await axios.get(`/admin/reports/${id}`);
    return response.data.data;
  },

  /**
   * Dismiss a report
   */
  async dismissReport(id: string, note?: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/dismiss`, {
      note,
    });
    return response.data.data;
  },

  /**
   * Acknowledge a report
   */
  async acknowledgeReport(id: string, note?: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/acknowledge`, {
      note,
    });
    return response.data.data;
  },

  /**
   * Ban story from report
   */
  async banStory(id: string, reason: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/ban-story`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Delete chapter from report
   */
  async deleteChapter(id: string, reason: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/delete-chapter`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Delete comment from report
   */
  async deleteComment(id: string, reason: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/delete-comment`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Warn user from report
   */
  async warnUser(id: string, message: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/warn-user`, {
      message,
    });
    return response.data.data;
  },

  /**
   * Ban user from report
   */
  async banUser(id: string, reason: string): Promise<Report> {
    const response = await axios.post(`/admin/reports/${id}/ban-user`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Get report logs (history)
   */
  async getReportLogs(id: string): Promise<ReportLog[]> {
    const response = await axios.get(`/admin/reports/${id}/logs`);
    return response.data.data;
  },
};
