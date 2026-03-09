// src/hooks/useStoryPage.ts
import { useQuery } from "@tanstack/react-query";
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
