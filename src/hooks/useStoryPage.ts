// src/hooks/useStoryPage.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StoryPageService } from "../services/StoryPageService";
import { showError, showSuccess } from "../utils/notifications";

export const useStories = () => {
	return useQuery({
		queryKey: ["stories"],
		queryFn: () => StoryPageService.getStories(),
	});
};

export const useStoryDetail = (slug?: string) => {
	return useQuery({
		queryKey: ["story", slug],
		queryFn: () => StoryPageService.getStoryBySlug(slug as string),
		enabled: !!slug,
	});
};

export const useCreateStory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: StoryPageService.createStory,
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

export const useMyStories = () => {
	return useQuery({
		queryKey: ["my-stories"],
		queryFn: () => StoryPageService.getMyStories(),
	});
};
