import { useQuery } from "@tanstack/react-query";
import CommentService from "../services/CommentService";

export const useCommentsByChapter = (chapterId: string, page: number, limit: number) => {
    return useQuery({
        queryKey: ["comments", chapterId, page, limit],
        queryFn: () => CommentService.getCommentsByChapter(chapterId, page, limit),
    });
};

export const useReplyComments = (commentId: string) => {
    return useQuery({
        queryKey: ["replies", commentId],
        queryFn: () => CommentService.getReplyComments(commentId),
        enabled: !!commentId,
    });
};
