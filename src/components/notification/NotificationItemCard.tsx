import { useState } from "react";
import {
  Trash2,
  UserPlus,
  BookOpen,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import { Avatar } from "@mantine/core";
import type { NotificationItem } from "../../services/NotificationService";
import { formatNotificationTime } from "../../utils/notification";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { showError, showSuccess } from "../../utils/notifications";

interface Props {
  notification: NotificationItem;
  onClick: () => void;
  onDelete: () => Promise<void> | void;
}

const getIcon = (type: NotificationItem["type"]) => {
  switch (type) {
    case "follow_user":
      return <UserPlus className="w-4 h-4 text-blue-600" />;
    case "story_approved":
    case "chapter_approved":
      return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    case "new_story_from_followed_author":
    case "new_chapter_from_followed_story":
      return <BookOpen className="w-4 h-4 text-blue-600" />;
    default:
      return <BellRing className="w-4 h-4 text-blue-600" />;
  }
};

export default function NotificationItemCard({
  notification,
  onClick,
  onDelete,
}: Props) {
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await onDelete();
      setOpenedDeleteModal(false);
      showSuccess("Đã xóa thông báo");
    } catch (error) {
      console.error(error);
      showError("Không thể xóa thông báo");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`group relative flex gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
          notification.status === "unread"
            ? "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-900"
            : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
        onClick={onClick}
      >
        <div className="relative shrink-0">
          <Avatar
            src={notification.from?.avatarURL || "/images/default-avatar.png"}
            radius="xl"
            size={40}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-blue-200 flex items-center justify-center dark:bg-gray-900 dark:border-blue-800">
            {getIcon(notification.type)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
              {notification.title}
            </p>

            {notification.status === "unread" && (
              <span className="mt-1 w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {notification.content}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {formatNotificationTime(notification.createdAt)}
          </p>
        </div>

        <div className="relative group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenedDeleteModal(true);
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 dark:hover:bg-red-950/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <span className="absolute right-0 top-full mt-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Xóa thông báo
          </span>
        </div>
      </div>

      <ConfirmDeleteModal
        opened={openedDeleteModal}
        onClose={() => setOpenedDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Xóa thông báo"
        message="Bạn có chắc chắn muốn xóa thông báo này không? Sau khi xóa sẽ không thể khôi phục."
        confirmText="Xóa thông báo"
        cancelText="Hủy"
      />
    </>
  );
}
