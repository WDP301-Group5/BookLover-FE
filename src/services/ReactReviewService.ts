import { instance } from "../lib/axios";

export type ReactReviewTypeValue =
  | "unlike"
  | "like"
  | "love"
  | "haha"
  | "wow"
  | "sad"
  | "angry";

const ReactReviewService = {
  async getUserReactReviews(reviewIds: string[]) {
    if (!reviewIds || !reviewIds.length) return null;

    const res = await instance
      .get(`/react/review/user`, {
        params: {
          reviewIds: reviewIds.join(","),
        },
      })
      .then((res) => res || [])
      .catch((err) => {
        console.error("Error when get user react reviews:", err);
        throw err;
      });

    return res?.data;
  },

  async userReactReview(reviewId: string, react: ReactReviewTypeValue) {
    if (!reviewId || !react) return null;

    const res = await instance
      .post(`/react/review/${reviewId}`, { react })
      .then((res) => res || [])
      .catch((err) => {
        console.error("Error when user react review:", err);
        throw err;
      });

    return res?.data;
  },
};

export default ReactReviewService;