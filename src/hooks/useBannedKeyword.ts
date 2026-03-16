import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { BannedKeywordService } from "../services/BannedKeywordService";

export const useBannedKeywords = () => {
  return useQuery({
    queryKey: ["admin", "banned-keywords"],
    queryFn: () => BannedKeywordService.getAll(),
  });
};

export const useCreateBannedKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      text: string;
      category: string;
      severity?: string;
      isRegex?: boolean;
    }) => BannedKeywordService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banned-keywords"] });
      notifications.show({
        title: "Thành công",
        message: "Đã thêm từ khóa cấm",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message: error.response?.data?.message || "Không thể thêm từ khóa",
        color: "red",
      });
    },
  });
};

export const useUpdateBannedKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        text: string;
        category: string;
        severity: string;
        isRegex: boolean;
        isActive: boolean;
      }>;
    }) => BannedKeywordService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banned-keywords"] });
      notifications.show({
        title: "Thành công",
        message: "Đã cập nhật từ khóa cấm",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message: error.response?.data?.message || "Không thể cập nhật từ khóa",
        color: "red",
      });
    },
  });
};

export const useDeleteBannedKeyword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hard }: { id: string; hard?: boolean }) =>
      BannedKeywordService.delete(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "banned-keywords"] });
      notifications.show({
        title: "Thành công",
        message: "Đã xóa từ khóa cấm",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Lỗi",
        message: error.response?.data?.message || "Không thể xóa từ khóa",
        color: "red",
      });
    },
  });
};
