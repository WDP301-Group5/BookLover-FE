// src/hooks/useChapterPage.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChapterPageService } from "../services/ChapterService";
import { showError, showSuccess } from "../utils/notifications";

export const useChaptersByStory = (storyId: string) => {
  return useQuery({
    queryKey: ["chapters", storyId],
    queryFn: () => ChapterPageService.getChaptersByStory(storyId),
    enabled: !!storyId,
  });
};

export const useChapterDetail = (chapterId?: string) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => ChapterPageService.getChapterById(chapterId as string),
    enabled: !!chapterId,
  });
};

export const useChapterByChapterNumber = (
  storySlug: string,
  chapterNumber: number,
) => {
  return useQuery({
    queryKey: ["chapter", storySlug, chapterNumber],
    queryFn: () =>
      ChapterPageService.getChapterByChapterNumber(
        storySlug,
        chapterNumber,
      ),
    enabled: !!storySlug && !!chapterNumber,
  });
};

export const useCreateChapter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ChapterPageService.createChapter,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapters"] });
			showSuccess("Tạo chương thành công");
		},
		onError: (error: Error) => {
			showError(error.message || "Lỗi khi tạo chương");
		},
	});
};
