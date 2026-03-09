import type { ReactTypeValue } from "../interfaces/ReactComment";
import { instance } from "../lib/axios";

const ReactCommentService = {
  async getUserReactOfChapter(chapterId: string, commentIds: string[]) {
    if (
      !chapterId ||
      !String(chapterId).trim() ||
      !commentIds ||
      !commentIds.length
    )
      return null;
    const res = await instance
      .get(`/react/comment/user/chapter/${chapterId}`, {
        params: {
          commentIds: commentIds.join(","),
        },
      })
      .then((res) => res || [])
      .catch((err) => {
        console.error("Error when get user react of chapter:", err);
        throw err;
      });
    return res?.data;
  },

  async userReactComment(
    commentId: string,
    chapterId: string,
    react: ReactTypeValue,
  ) {
    if (!commentId || !chapterId) return null;
    const res = await instance
      .post(`/react/comment/user/comment/${commentId}`, { chapterId, react })
      .then((res) => res || [])
      .catch((err) => {
        console.error("Error when user react comment:", err);
        throw err;
      });
    return res?.data;
  },
};

export default ReactCommentService;
