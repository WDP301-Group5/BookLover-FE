import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9999";

export interface StoryDetail {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  authorId: {
    _id: string;
    username: string;
  };
  topics: string[];
  tags: string[];
  status: string;
  isPremium: boolean;
  isFinish: boolean;
  views: number;
  stars: number;
  rates: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export const StoryService = {
  getStoryBySlug(slug: string) {
    return axios.get<StoryDetail>(
      `${API_BASE_URL}/api/stories/${slug}`,
    );
  },

  followStory(storyId: string) {
    return axios.post(`${API_BASE_URL}/api/stories/${storyId}/follow`);
  },

  unfollowStory(storyId: string) {
    return axios.post(`${API_BASE_URL}/api/stories/${storyId}/unfollow`);
  },
};
