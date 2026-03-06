import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AdminChapterCensorService } from "../services/AdminChapterCensorService";

interface ModerationAction {
  id: string;
  reason?: string;
}

export const useApproveChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminChapterCensorService.approveChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã phê duyệt chương truyện",
        color: "green",
      });
    },
    onError: (error: AxiosError<any>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể phê duyệt chương truyện",
        color: "red",
      });
    },
  });
};

export const useRejectChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: ModerationAction) =>
      AdminChapterCensorService.rejectChapter(id, reason || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã từ chối chương truyện",
        color: "blue",
      });
    },
    onError: (error: AxiosError<any>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể từ chối chương truyện",
        color: "red",
      });
    },
  });
};

export const useBanChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: ModerationAction) =>
      AdminChapterCensorService.banChapter(id, reason || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã khóa chương truyện",
        color: "orange",
      });
    },
    onError: (error: AxiosError<any>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể khóa chương truyện",
        color: "red",
      });
    },
  });
};

export const useUnbanChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminChapterCensorService.unbanChapter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã mở khóa chương truyện",
        color: "green",
      });
    },
    onError: (error: AxiosError<any>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể mở khóa chương truyện",
        color: "red",
      });
    },
  });
};
