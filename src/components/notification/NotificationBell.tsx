import { Bell } from "lucide-react";
import { Menu as MantineMenu } from "@mantine/core";
import { useEffect } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotification } from "../../hooks/useNotification";
import { useUserStore } from "../../stores/useUserStore";

export default function NotificationBell() {
  const { isLoggedIn } = useUserStore();

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markOneAsRead,
    markAllAsRead,
    deleteOne,
    resetNotifications,
  } = useNotification(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount();
    } else {
      resetNotifications();
    }
  }, [isLoggedIn, fetchUnreadCount, resetNotifications]);

  if (!isLoggedIn) return null;

  return (
    <MantineMenu
      shadow="lg"
      width={380}
      position="bottom-end"
      offset={10}
      withinPortal
      onOpen={fetchNotifications}
    >
      <MantineMenu.Target>
        <button
          className="hidden sm:flex relative p-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
          aria-label="Thông báo"
          title="Thông báo"
        >
          <Bell className="w-5 h-5" />

          {unreadCount > 0 && (
            <>
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            </>
          )}
        </button>
      </MantineMenu.Target>

      <MantineMenu.Dropdown className="p-0 bg-transparent border-0 shadow-none">
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkAllAsRead={markAllAsRead}
          onMarkOneAsRead={markOneAsRead}
          onDeleteOne={deleteOne}
        />
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
}