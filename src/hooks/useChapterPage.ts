// src/hooks/useChapterPage.ts
import { useQuery } from "@tanstack/react-query";
import { ChapterPageService } from "../services/ChapterPageService";

export const useChaptersByStory = (storyId?: string) => {
  return useQuery({
    queryKey: ["chapters", storyId],
    queryFn: () =>
      ChapterPageService.getChaptersByStory(storyId as string),
    enabled: !!storyId,
  });
};

export const useChapterDetail = (chapterId?: string) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () =>
      ChapterPageService.getChapterById(chapterId as string),
    enabled: !!chapterId,
  });
};
