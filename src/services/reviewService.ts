// src/services/reviewService.ts
import { instance } from "../lib/axios";

export interface ReviewStoryItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  cover: string;
  link: string;
  genre: string;
  genres: string[];
  topics: string[];
  views: number;
  followers: number;
  isPremium: boolean;
  author: {
    id: string;
    penName: string;
    avatarURL?: string;
  };
}

export interface ReviewItem {
  id: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  replyCount: number;
  react: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  story: ReviewStoryItem;
}

export interface ReviewStoriesResponse {
  message: string;
  data: {
    total: number;
    items: ReviewStoryItem[];
  };
}

export interface ReviewsResponse {
  message: string;
  data: {
    sort: "newest" | "oldest";
    total: number;
    items: ReviewItem[];
  };
}

export interface CreateReviewPayload {
  storyId: string;
  content: string;
}

const ReviewService = {
  async getReviewStories(search: string = "", limit: number = 50) {
    try {
      const response = await instance
        .get<ReviewStoriesResponse>("/review/stories", {
          params: {
            search,
            limit,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching review stories:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error fetching review stories:", error);
      throw error;
    }
  },

  async getReviews(params?: {
    sort?: "newest" | "oldest";
    genre?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const response = await instance
        .get<ReviewsResponse>("/review", {
          params: {
            sort: params?.sort || "newest",
            genre: params?.genre || "",
            search: params?.search || "",
            page: params?.page || 1,
            limit: params?.limit || 20,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching reviews:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  async createReview(payload: CreateReviewPayload) {
    try {
      const response = await instance
        .post<{ message: string; data: ReviewItem }>("/review", payload)
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error creating review:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },
};

export default ReviewService;