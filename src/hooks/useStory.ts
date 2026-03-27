// src/hooks/useStory.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import StoryService from "../services/StoryService";
import { AuthorService } from "../services/AuthorService";
import type { Story } from "../interfaces/Story";
import { showError, showSuccess } from "../utils/notifications";
import axios from "axios";

export const useRecommendStory = () => {
  return useQuery({
    queryKey: ["recommendStory"],
    queryFn: () => StoryService.getRecommendStory(),
  });
};

export const useNewChapterStory = (page: number = 1, limit: number = 24) => {
  return useQuery({
    queryKey: ["newChapterStory", page, limit],
    queryFn: () => StoryService.getNewChapterStory(page, limit),
  });
};

export const useTop10Story = (type: "m" | "w" | "d" = "m") => {
  return useQuery({
    queryKey: ["topStory", type],
    queryFn: () => StoryService.getTop10Story(type),
  });
};

export const useStoryDetail = (slug?: string) => {
  const query = useQuery({
    queryKey: ["story", slug],
    queryFn: () => StoryService.getStoryBySlug(slug as string),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if story is hidden or not found
      if (error?.message === "STORY_HIDDEN_BY_AUTHOR" || error?.response?.status === 404) {
        return false;
      }
      // Retry other errors up to 1 time
      return failureCount < 1;
    },
  });
  return {
    ...query,
    isHidden: (query.error as any)?.message === "STORY_HIDDEN_BY_AUTHOR",
  };
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: StoryService.createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["my-stories"] });
      showSuccess("Tạo truyện thành công");
    },
    onError: (error: Error) => {
      showError(error.message || "Lỗi khi tạo truyện");
    },
  });
};

export const useMyStories = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["my-stories", page, limit],
    queryFn: () => AuthorService.getMyStories(page, limit),
    placeholderData: keepPreviousData,
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AuthorService.deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-stories"] });
      showSuccess("Xóa truyện thành công");
    },
    onError: (error: Error) => {
      showError(error.message || "Lỗi khi xóa truyện");
    },
  });
};

export const useUpdateStory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Story> }) =>
      AuthorService.updateStory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-stories"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Lỗi khi cập nhật truyện");
    },
  });
};

export interface StoryQueryParams {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
}

export interface StoriesResponse {
  story: Story[];
  total: number;
}

export const useStories = (params: StoryQueryParams) => {
  return useQuery<StoriesResponse, Error>({
    queryKey: ["stories", params],
    queryFn: () => StoryService.getStoriesWithFilter(params),
    placeholderData: keepPreviousData,
  });
};

export const useStoryDetailWithAuthor = (slug: string) =>
  useQuery(["story", slug], async () => {
    const res = await axios.get(`/api/v1/story/with-author/${slug}`);
    return res.data;
  });

export const useAllStory = () => {
  return useQuery({
    queryKey: ["allStory"],
    queryFn: () => StoryService.getAllStory(),
  });
};

export const useRateStory = (slug?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storyId, rate }: { storyId: string; rate: number }) =>
      StoryService.rateStory(storyId, rate),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["story", slug] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      showSuccess("Đánh giá truyện thành công");
    },

    onError: (error: Error) => {
      showError(error.message || "Lỗi khi đánh giá truyện");
    },
  });
};
