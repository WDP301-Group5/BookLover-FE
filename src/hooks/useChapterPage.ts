// src/hooks/useChapterPage.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChapterPageService } from "../services/ChapterPageService";
import { showError, showSuccess } from "../utils/notifications";

export const useChaptersByStory = (storyId?: string) => {
	return useQuery({
		queryKey: ["chapters", storyId],
		queryFn: () => ChapterPageService.getChaptersByStory(storyId as string),
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
