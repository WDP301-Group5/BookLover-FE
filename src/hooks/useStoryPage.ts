// src/hooks/useStoryPage.ts
import { useQuery } from "@tanstack/react-query";
import { StoryPageService } from "../services/StoryPageService";

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
