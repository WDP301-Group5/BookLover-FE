import { useCallback, useEffect, useState } from "react";
import NotificationService, {
  type NotificationItem,
} from "../services/NotificationService";

export const useNotification = (enabled: boolean = true) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      const data = await NotificationService.getNotifications({
        page: 1,
        limit: 10,
      });

      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách notification:", error);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const fetchUnreadCount = useCallback(async () => {
    if (!enabled) return;

    try {
      const data = await NotificationService.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Lỗi lấy unread count:", error);
    }
  }, [enabled]);

  const markOneAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, status: "read" } : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Lỗi mark as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          status: "read",
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi mark all as read:", error);
    }
  }, []);

  const deleteOne = useCallback(async (notificationId: string) => {
    try {
      const target = notifications.find((item) => item._id === notificationId);

      await NotificationService.deleteNotification(notificationId);

      setNotifications((prev) => prev.filter((item) => item._id !== notificationId));

      if (target?.status === "unread") {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Lỗi delete notification:", error);
    }
  }, [notifications]);

  useEffect(() => {
    if (!enabled) return;
    fetchUnreadCount();
  }, [enabled, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  };
};