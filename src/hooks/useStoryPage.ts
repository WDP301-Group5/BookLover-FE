// src/hooks/useStoryPage.ts
import { useQuery } from "@tanstack/react-query";
import { StoryPageService } from "../services/StoryPageService";

export const useStories = () => {
  return useQuery({
    queryKey: ["stories"],
    queryFn: () => StoryPageService.getStories(),
  });
};

export const useStoryDetail = (storyId?: string) => {
  return useQuery({
    queryKey: ["story", storyId],
    queryFn: () => StoryPageService.getStoryById(storyId as string),
    enabled: !!storyId,
  });
};



