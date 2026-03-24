import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import socket from "../lib/socket";
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
    onError: (error: AxiosError) => {
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
    onError: (error: AxiosError) => {
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
    onError: (error: AxiosError) => {
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
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể mở khóa chương truyện",
        color: "red",
      });
    },
  });
};

export const useOverrideDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      decision,
      reason,
    }: ModerationAction & { decision: "active" | "rejected" }) =>
      AdminChapterCensorService.overrideDecision(id, decision, reason || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã ghi nhận quyết định override",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Không thể override quyết định",
        color: "red",
      });
    },
  });
};

export const useQueueStatus = () => {
  return useQuery({
    queryKey: ["admin", "chapters", "queue", "status"],
    queryFn: () => AdminChapterCensorService.getQueueStatus(),
    refetchInterval: 30000,
  });
};

export const useRetryFailedJobs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AdminChapterCensorService.retryFailedJobs(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "queue", "status"],
      });
      notifications.show({
        title: "Thành công",
        message: `Đã thêm ${count} job vào hàng đợi`,
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message: error.response?.data?.message || "Không thể retry jobs",
        color: "red",
      });
    },
  });
};

export const useOverrideStatistics = () => {
  return useQuery({
    queryKey: ["admin", "chapters", "statistics", "overrides"],
    queryFn: () => AdminChapterCensorService.getOverrideStatistics(),
  });
};

export const useTriggerAIAnalysis = (onComplete?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await AdminChapterCensorService.triggerAIAnalysis(id);

      if (!socket.connected) {
        socket.connect();
      }

      const handleAIComplete = () => {
        queryClient.invalidateQueries({
          queryKey: ["admin", "chapters", "pending"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", "chapters", "managed"],
        });
        socket.off("ai-analysis-complete", handleAIComplete);
        onComplete?.();
      };

      socket.on("ai-analysis-complete", handleAIComplete);

      setTimeout(() => {
        socket.off("ai-analysis-complete", handleAIComplete);
      }, 30000);

      return result;
    },
    onSuccess: () => {
      // Immediately refetch data table after API call completes
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã bắt đầu phân tích AI",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message: error.response?.data?.message || "Không thể phân tích AI",
        color: "red",
      });
    },
  });
};
