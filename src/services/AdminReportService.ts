import axiosClient from "../api/axiosClient";

export interface Report {
  _id: string;
  userId: string;
  type: "Story" | "Chapter" | "Comment";
  reportId: string;
  content: string;
  status: "pending" | "success" | "failed";
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
  reporterName?: string;
  reporterUsername?: string;
  targetPreview?: {
    title?: string;
    authorName?: string;
    status?: string;
    image?: string;
    chapterNumber?: number;
    content?: string;
  };
}

export interface ReportLog {
  _id: string;
  reportId: string;
  adminId: {
    _id: string;
    username: string;
    fullName: string;
    avatarURL: string;
  };
  action:
    | "dismiss"
    | "acknowledge"
    | "ban_story"
    | "delete_chapter"
    | "delete_comment"
    | "warn_user"
    | "ban_user";
  note?: string;
  metadata?: {
    storyBanned?: boolean;
    chapterDeleted?: boolean;
    commentDeleted?: boolean;
    userWarned?: boolean;
    userBanned?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetReportsParams {
  status?: "pending" | "success" | "failed";
  type?: "Story" | "Chapter" | "Comment";
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const AdminReportService = {
  /**
   * Get list of reports with filters and pagination
   */
  async getReports(params: GetReportsParams): Promise<GetReportsResponse> {
    const response = await axiosClient.get("/admin/reports", { params });
    return response.data.data;
  },

  /**
   * Get report detail by ID
   */
  async getReport(id: string): Promise<Report> {
    const response = await axiosClient.get(`/admin/reports/${id}`);
    return response.data.data;
  },

  /**
   * Dismiss a report
   */
  async dismissReport(id: string, note?: string): Promise<Report> {
    const response = await axiosClient.post(`/admin/reports/${id}/dismiss`, {
      note,
    });
    return response.data.data;
  },

  /**
   * Acknowledge a report
   */
  async acknowledgeReport(id: string, note?: string): Promise<Report> {
    const response = await axiosClient.post(
      `/admin/reports/${id}/acknowledge`,
      { note },
    );
    return response.data.data;
  },

  /**
   * Ban story from report
   */
  async banStory(id: string, reason: string): Promise<Report> {
    const response = await axiosClient.post(`/admin/reports/${id}/ban-story`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Delete chapter from report
   */
  async deleteChapter(id: string, reason: string): Promise<Report> {
    const response = await axiosClient.post(
      `/admin/reports/${id}/delete-chapter`,
      { reason },
    );
    return response.data.data;
  },

  /**
   * Delete comment from report
   */
  async deleteComment(id: string, reason: string): Promise<Report> {
    const response = await axiosClient.post(
      `/admin/reports/${id}/delete-comment`,
      { reason },
    );
    return response.data.data;
  },

  /**
   * Warn user from report
   */
  async warnUser(id: string, message: string): Promise<Report> {
    const response = await axiosClient.post(`/admin/reports/${id}/warn-user`, {
      message,
    });
    return response.data.data;
  },

  /**
   * Ban user from report
   */
  async banUser(id: string, reason: string): Promise<Report> {
    const response = await axiosClient.post(`/admin/reports/${id}/ban-user`, {
      reason,
    });
    return response.data.data;
  },

  /**
   * Get report logs (history)
   */
  async getReportLogs(id: string): Promise<ReportLog[]> {
    const response = await axiosClient.get(`/admin/reports/${id}/logs`);
    return response.data.data;
  },
};
