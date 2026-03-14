import { instance } from "../lib/axios";

export interface RankingStoryItem {
  rank: number;
  id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  authorId: string;
  author: string;
  topics: string[];
  genres: string[];
  views: number;
  followers: number;
  rates: number;
  stars: number;
  chapters: number;
  isPremium: boolean;
  isFinish: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankingAuthorItem {
  rank: number;
  id: string;
  penName: string;
  username: string;
  avatarUrl: string;
  followersCount: number;
  storiesCount: number;
  totalViews: number;
  totalVotes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankingUserItem {
  rank: number;
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  totalComments: number;
  totalSpent: number;
  spiritStones?: number;
  rawTotalSpent?: number;
  vipLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RankingResponse<T> {
  message: string;
  data: {
    type: string;
    total: number;
    items: T[];
    note?: string;
  };
}

const RankingService = {
  async getTopStories(type: "views" | "followers" = "views", limit: number = 15) {
    try {
      const response = await instance
        .get<RankingResponse<RankingStoryItem>>("/rankings/stories", {
          params: {
            type,
            limit,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching top stories ranking:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error fetching top stories ranking:", error);
      throw error;
    }
  },

  async getTopAuthors(type: "followers" | "stories" = "followers", limit: number = 30) {
    try {
      const response = await instance
        .get<RankingResponse<RankingAuthorItem>>("/rankings/authors", {
          params: {
            type,
            limit,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching top authors ranking:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error fetching top authors ranking:", error);
      throw error;
    }
  },

  async getTopUsers(type: "comments" | "spent" = "comments", limit: number = 30) {
    try {
      const response = await instance
        .get<RankingResponse<RankingUserItem>>("/rankings/users", {
          params: {
            type,
            limit,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching top users ranking:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error fetching top users ranking:", error);
      throw error;
    }
  },
};

export default RankingService;