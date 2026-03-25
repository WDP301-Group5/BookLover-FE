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

// ── AI Analysis Hooks ────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import type { AIAnalysis, Story } from "../interfaces/AIAnalysis";

export interface AnalyzeStoryResponse {
  story: Story;
  analysis: AIAnalysis;
}

/**
 * Hook to run AI analysis on a story
 */
export const useAnalyzeStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminCensorService.analyzeStory(id),
    onSuccess: (data) => {
      // Check if there's an error in the analysis response
      if (data.analysis.error) {
        notifications.show({
          title: "Lỗi phân tích AI",
          message: data.analysis.error,
          color: "red",
        });
        return;
      }
      // Invalidate pending stories to refresh with AI data
      queryClient.invalidateQueries({
        queryKey: ["admin", "stories", "pending"],
      });
      // Also invalidate the data table query key used in AdminPendingStories
      queryClient.invalidateQueries({
        queryKey: ["pending-stories", "with-ai"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã phân tích AI thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi phân tích AI",
        color: "red",
      });
    },
  });
};

/**
 * Hook to get AI analysis for a specific story
 */
export const useStoryAIAnalysis = (storyId: string | null) => {
  return useQuery({
    queryKey: ["admin", "story", "ai-analysis", storyId],
    queryFn: () => AdminCensorService.getStoryAIAnalysis(storyId!),
    enabled: !!storyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
