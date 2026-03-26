import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NotificationItem } from "../../services/NotificationService";
import NotificationItemCard from "./NotificationItemCard";
import { getNotificationLink } from "../../utils/notification";

interface Props {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  onMarkAllAsRead: () => void;
  onMarkOneAsRead: (id: string) => void;
  onDeleteOne: (id: string) => void;
  onClose?: () => void;
}

export default function NotificationDropdown({
  notifications,
  unreadCount,
  loading,
  onMarkAllAsRead,
  onMarkOneAsRead,
  onDeleteOne,
  onClose,
}: Props) {
  const navigate = useNavigate();

  const handleClickNotification = async (notification: NotificationItem) => {
    const targetLink = getNotificationLink(notification);

    try {
      if (notification.status === "unread") {
        await onMarkOneAsRead(notification._id);
      }
    } catch (error) {
      console.error("Không thể đánh dấu đã đọc:", error);
    } finally {
      onClose?.();
      navigate(targetLink);
    }
  };

  return (
    <div className="w-[380px] max-w-[90vw] bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 dark:border-gray-700 dark:from-gray-900 dark:to-gray-900">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Thông báo
          </h3>
          <p className="text-xs text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} thông báo chưa đọc`
              : "Bạn đã xem hết thông báo"}
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Đọc tất cả
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto p-3 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-blue-600 text-4xl mb-2">🔔</div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Chưa có thông báo nào
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Khi có hoạt động mới, bạn sẽ thấy ở đây
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItemCard
              key={notification._id}
              notification={notification}
              onClick={() => handleClickNotification(notification)}
              onDelete={() => onDeleteOne(notification._id)}
            />
          ))
        )}
      </div>

      <div className="border-t border-blue-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-950">
        <button
          onClick={() => {
            onClose?.();
            navigate("/notifications");
          }}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
}
