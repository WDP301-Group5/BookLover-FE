// src/hooks/useChapterPage.ts
import { useQuery } from "@tanstack/react-query";
import { ChapterPageService } from "../services/ChapterService";

export const useChaptersByStory = (storyId: string) => {
  return useQuery({
    queryKey: ["chapters", storyId],
    queryFn: () => ChapterPageService.getChaptersByStory(storyId),
    enabled: !!storyId,
  });
};

export const useChapterDetail = (chapterId?: string) => {
  return useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: () => ChapterPageService.getChapterById(chapterId as string),
    enabled: !!chapterId,
  });
};

export const useChapterByChapterNumber = (
  storySlug: string,
  chapterNumber: number,
) => {
  return useQuery({
    queryKey: ["chapter", storySlug, chapterNumber],
    queryFn: () =>
      ChapterPageService.getChapterByChapterNumber(
        storySlug,
        chapterNumber,
      ),
    enabled: !!storySlug && !!chapterNumber,
  });
};
