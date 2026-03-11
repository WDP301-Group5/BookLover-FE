// src/hooks/useStory.ts
import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query"; 
import StoryService from "../services/StoryService";
import type { Story, StoryItem } from "../interfaces/Story";

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

export interface StoryQueryParams {
  page: number;
  limit: number;
  status?: string;
  category?: string;
  search?: string;
  sortBy?: string;
}

export interface StoriesResponse {
  story: Story[];
  total: number;
}

export const useStories = (params: StoryQueryParams) => {
  return useQuery<StoriesResponse, Error>({
    queryKey: ["stories", params],
    queryFn: () => StoryService.getStoriesWithFilter(params),
    placeholderData: keepPreviousData,
  });
};