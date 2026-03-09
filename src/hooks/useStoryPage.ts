// src/hooks/useStoryPage.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "../utils/notifications";
import StoryService from "../services/StoryService";

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => StoryService.getStories(),
  });
};

export const useStoryDetail = (slug?: string) => {
  return useQuery({
    queryKey: ["story", slug],
    queryFn: () => StoryService.getStoryBySlug(slug as string),
    enabled: !!slug,
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
