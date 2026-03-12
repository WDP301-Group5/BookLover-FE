import type { NotificationItem } from "../services/NotificationService";

export const formatNotificationTime = (date?: string) => {
  if (!date) return "";

  const now = new Date().getTime();
  const created = new Date(date).getTime();
  const diffMs = now - created;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Vừa xong";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)} ngày trước`;

  return new Date(date).toLocaleDateString("vi-VN");
};

export const getNotificationLink = (notification: NotificationItem) => {
  const data = notification.data || {};

  switch (notification.type) {
    case "follow_user":
      return data.followerId ? `/user/${data.followerId}/profile` : "/notifications";

    case "story_approved":
      return data.storySlug ? `/story/${data.storySlug}` : "/notifications";

    case "new_story_from_followed_author":
      return data.storySlug ? `/story/${data.storySlug}` : "/notifications";

    case "chapter_approved":
      return data.storySlug ? `/story/${data.storySlug}` : "/notifications";

    case "new_chapter_from_followed_story":
      return data.storySlug ? `/story/${data.storySlug}` : "/notifications";

    default:
      return "/notifications";
  }
};