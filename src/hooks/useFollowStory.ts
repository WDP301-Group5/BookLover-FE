import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FollowStoryService from "../services/FollowStoryService";

export const useCheckUserFollowStory = (storyId: string) => {
  return useQuery({
    queryKey: ["checkUserFollowStory", storyId],
    queryFn: () => FollowStoryService.checkUserFollowStory(storyId),
    enabled: !!storyId,
  });
};

export const useChangeStatusFollowStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      storyId,
      status,
    }: {
      storyId: string;
      status: "follow" | "unfollow" | "unsend";
    }) => FollowStoryService.changeStatusFollowStory(storyId, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["checkUserFollowStory", variables.storyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myFollowedStories"],
      });
    },
  });
};

export const useMyFollowedStories = () => {
  return useQuery({
    queryKey: ["myFollowedStories"],
    queryFn: () => FollowStoryService.getMyFollowedStories(),
  });
};