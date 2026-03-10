import { instance } from "../lib/axios";
import { showError } from "../utils/notifications";

const CommentService = {
    async getCommentsByChapter(chapterId: string, page: number, limit: number) {
        if (!chapterId) return null;
        const response = await instance
            .get(`/comment/chapter/${chapterId}`, {
                params: {
                    page,
                    limit,
                },
            })
            .then((res) => res || [])
            .catch((err) => {
                console.error("Error when get comments by of chapter:", err);
                throw err;
            });
        return response?.data;
    },
    async submitComment(chapterId: string, content: string) {
        const response = await instance
            .post(`/comment/chapter/${chapterId}`, {
                content,
            })
            .then((res) => res || [])
            .catch((err) => {
                console.error("Error submit comment:", err);
                showError(err?.response?.data?.message);
                throw err;
            });
        return response?.data;
    },

    async updateComment(commentId: string, content: string) {
        const response = await instance
            .put(`/comment/${commentId}`, {
                content,
            })
            .then((res) => res || [])
            .catch((err) => {
                console.error("Error update comment:", err);
                throw err;
            });
        return response?.data;
    },

    async submitReply(commentId: string, content: string) {
        const response = await instance
            .post(`/comment/reply/${commentId}`, {
                content,
            })
            .then((res) => res || [])
            .catch((err) => {
                console.error("Error submit reply:", err);
                showError(err?.response?.data?.message);
                throw err;
            });
        return response?.data;
    },

    async getReplyComments(commentId: string) {
        if (!commentId || !String(commentId).trim()) return null;
        const response = await instance
            .get(`/comment/reply/${commentId}`)
            .then((res) => res || [])
            .catch((err) => {
                console.error("Error when get reply comments:", err);
                throw err;
            });
        return response?.data;
    },
};

export default CommentService;