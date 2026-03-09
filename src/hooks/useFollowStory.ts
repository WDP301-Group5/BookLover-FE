import { useQuery } from "@tanstack/react-query";
import FollowStoryService from "../services/FollowStoryService";

export const useCheckUserFollowStory = (storyId: string) => {
    return useQuery({
        queryKey: ["checkUserFollowStory", storyId],
        queryFn: () => FollowStoryService.checkUserFollowStory( storyId ),
    });
};