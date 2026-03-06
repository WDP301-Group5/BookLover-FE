import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AdminCensorService } from "../services/AdminCensorService";

interface ErrorResponse {
  message: string;
}

export const useApproveStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminCensorService.approveStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã duyệt truyện thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi duyệt truyện",
        color: "red",
      });
    },
  });
};

export const useRejectStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminCensorService.rejectStory(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã từ chối truyện thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi từ chối truyện",
        color: "red",
      });
    },
  });
};

export const useBanStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminCensorService.banStory(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã khóa truyện thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi khóa truyện",
        color: "red",
      });
    },
  });
};

export const useUnbanStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminCensorService.unbanStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã mở khóa truyện thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi mở khóa truyện",
        color: "red",
      });
    },
  });
};
