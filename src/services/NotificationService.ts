import axiosClient from "../api/axiosClient";

export type NotificationType =
  | "follow_user"
  | "story_approved"
  | "new_story_from_followed_author"
  | "chapter_approved"
  | "new_chapter_from_followed_story";

export interface NotificationUser {
  _id: string;
  username: string;
  fullName: string;
  avatarURL?: string;
}

export interface NotificationItem {
  _id: string;
  from: NotificationUser | null;
  to: string;
  type: NotificationType;
  title: string;
  content: string;
  status: "read" | "unread";
  data?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

const NotificationService = {
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    status?: "read" | "unread";
  }): Promise<NotificationListResponse> {
    const res = await axiosClient.get("/notifications", {
      params,
    });
    return res.data.data;
  },

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const res = await axiosClient.get("/notifications/unread-count");
    return res.data.data;
  },

  async markAsRead(notificationId: string) {
    const res = await axiosClient.patch(`/notifications/${notificationId}/read`);
    return res.data.data;
  },

  async markAllAsRead() {
    const res = await axiosClient.patch("/notifications/read-all");
    return res.data;
  },

  async deleteNotification(notificationId: string) {
    const res = await axiosClient.delete(`/notifications/${notificationId}`);
    return res.data;
  },
};

export default NotificationService;