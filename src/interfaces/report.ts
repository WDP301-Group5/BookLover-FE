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
