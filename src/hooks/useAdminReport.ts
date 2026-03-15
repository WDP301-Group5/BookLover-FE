import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AdminReportService } from "../services/AdminReportService";

interface ErrorResponse {
  message: string;
}

/**
 * Hook to get list of reports with filters
 */
export const useReports = (
  params: {
    status?: "pending" | "success" | "failed";
    type?: "Story" | "Chapter" | "Comment";
    search?: string;
    page?: number;
    limit?: number;
  } = {},
) => {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => AdminReportService.getReports(params),
  });
};

/**
 * Hook to get report detail
 */
export const useReport = (id: string | null) => {
  return useQuery({
    queryKey: ["admin", "report", id],
    queryFn: () => AdminReportService.getReport(id!),
    enabled: !!id,
  });
};

/**
 * Hook to get report logs (history)
 */
export const useReportLogs = (id: string | null) => {
  return useQuery({
    queryKey: ["admin", "report", id, "logs"],
    queryFn: () => AdminReportService.getReportLogs(id!),
    enabled: !!id,
  });
};

/**
 * Hook to dismiss report
 */
export const useDismissReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      AdminReportService.dismissReport(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã từ chối báo cáo thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi từ chối báo cáo",
        color: "red",
      });
    },
  });
};

/**
 * Hook to acknowledge report
 */
export const useAcknowledgeReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      AdminReportService.acknowledgeReport(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã xác nhận báo cáo thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi xác nhận báo cáo",
        color: "red",
      });
    },
  });
};

/**
 * Hook to ban story from report
 */
export const useBanStoryFromReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminReportService.banStory(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
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

/**
 * Hook to delete chapter from report
 */
export const useDeleteChapterFromReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminReportService.deleteChapter(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "managed"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã xóa chương thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi xóa chương",
        color: "red",
      });
    },
  });
};

/**
 * Hook to delete comment from report
 */
export const useDeleteCommentFromReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminReportService.deleteComment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã xóa bình luận thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi xóa bình luận",
        color: "red",
      });
    },
  });
};

/**
 * Hook to warn user from report
 */
export const useWarnUserFromReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      AdminReportService.warnUser(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã cảnh báo người dùng thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cảnh báo người dùng",
        color: "red",
      });
    },
  });
};

/**
 * Hook to ban user from report
 */
export const useBanUserFromReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      AdminReportService.banUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "reports"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "accounts"],
      });
      notifications.show({
        title: "Thành công",
        message: "Đã khóa người dùng thành công",
        color: "green",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra khi khóa người dùng",
        color: "red",
      });
    },
  });
};
