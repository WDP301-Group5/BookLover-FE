import { useQuery } from "@tanstack/react-query";
import StoryService from "../services/StoryService";

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