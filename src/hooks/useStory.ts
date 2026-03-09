import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StoryService from "../services/StoryService";
import { showError, showSuccess } from "../utils/notifications";

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
	return useQuery({
		queryKey: ["story", slug],
		queryFn: () => StoryService.getStoryBySlug(slug as string),
		enabled: !!slug,
	});
};

export const useStories = () => {
	return useQuery({
		queryKey: ["stories"],
		queryFn: () => StoryService.getStories(),
	});
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

export const useMyStories = () => {
	return useQuery({
		queryKey: ["my-stories"],
		queryFn: () => StoryService.getMyStories(),
	});
};
