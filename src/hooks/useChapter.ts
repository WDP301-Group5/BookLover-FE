// src/hooks/useChapterPage.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChapterPageService } from "../services/ChapterService";
import { AuthorService } from "../services/AuthorService";
import { showError, showSuccess } from "../utils/notifications";

export const useChaptersByStory = (storyId: string) => {
  return useQuery({
    queryKey: ["chapters", storyId],
    queryFn: () => ChapterPageService.getChaptersByStory(storyId),
    enabled: !!storyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useChaptersByStoryForAuthor = (storyId: string) => {
  return useQuery({
    queryKey: ["author-chapters", storyId],
    queryFn: () => AuthorService.getChaptersByStoryForAuthor(storyId),
    enabled: !!storyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useChapterDetail = (chapterId?: string) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => ChapterPageService.getChapterById(chapterId as string),
    enabled: !!chapterId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useChapterByChapterNumber = (
  storySlug: string,
  chapterNumber: number,
) => {
  const query = useQuery({
    queryKey: ["chapter", storySlug, chapterNumber],
    queryFn: () =>
      ChapterPageService.getChapterByChapterNumber(storySlug, chapterNumber),
    enabled: !!storySlug && !!chapterNumber,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry if chapter is hidden or not found
      if (error?.message === "CHAPTER_HIDDEN_BY_AUTHOR" || error?.response?.status === 404) {
        return false;
      }
      // Retry other errors up to 1 time
      return failureCount < 1;
    },
  });
  return {
    ...query,
    isHidden: (query.error as any)?.message === "CHAPTER_HIDDEN_BY_AUTHOR",
  };
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ChapterPageService.createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["author-chapters"] });
      showSuccess("Tạo chương thành công");
    },
    onError: (error: Error) => {
      showError(error.message || "Lỗi khi tạo chương");
    },
  });
};

export const useUpdateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      AuthorService.updateChapter(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      queryClient.invalidateQueries({ queryKey: ["author-chapters"] });
    },
    onError: (error: Error) => {
      showError(error.message || "Lỗi khi cập nhật chương");
    },
  });
};
