import { useEffect } from "react";
import { Container, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import NotificationItemCard from "../../components/notification/NotificationItemCard";
import { getNotificationLink } from "../../utils/notification";
import { useUserStore } from "../../stores/useUserStore";

export default function NotificationPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
  } = useNotification(isLoggedIn);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Container size="md" py="xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title order={2}>Thông báo</Title>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `Bạn có ${unreadCount} thông báo chưa đọc`
              : "Không có thông báo chưa đọc"}
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
        >
          Đọc tất cả
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Chưa có thông báo nào</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItemCard
              key={notification._id}
              notification={notification}
              onClick={async () => {
                if (notification.status === "unread") {
                  await markOneAsRead(notification._id);
                }
                navigate(getNotificationLink(notification));
              }}
              onDelete={() => deleteOne(notification._id)}
            />
          ))
        )}
      </div>
    </Container>
  );
}