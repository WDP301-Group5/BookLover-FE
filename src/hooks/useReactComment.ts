import { useQuery } from "@tanstack/react-query";
import ReactCommentService from "../services/ReactCommentService";

export const useUserReactOfChapter = (
  chapterId: string,
  page: number,
  commentIds: string[],
) => {
  return useQuery({
    queryKey: ["userReactOfChapter", chapterId, page, commentIds],
    queryFn: () =>
      ReactCommentService.getUserReactOfChapter(chapterId, commentIds),
  });
};
