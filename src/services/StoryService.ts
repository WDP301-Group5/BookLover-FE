import type { Story, StoryItem } from "../interfaces/Story";
import { instance } from "../lib/axios";

const StoryService = {
  // Truyện đề cử - HomePage
  async getRecommendStory() {
    try {
      const response = await instance
        .get("/story/recommend")
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          throw err;
        });
      return response?.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Truyện có chương mới - HomePage
  async getNewChapterStory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/story/newchapter", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          throw err;
        });
      return response?.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Top truyện - HomePage - TopStoryTable
  async getTop10Story(type: "m" | "w" | "d" = "m") {
    // month, week, day
    try {
      const response = await instance
        .get("/story/top10", {
          params: {
            type: type,
          },
        })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          throw err;
        });
      return response?.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  async getStories(): Promise<StoryItem[]> {
    const res = await instance.get<Story[]>("/story");
    console.log(res.data);
    return res.data.map((s) => {
      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        image: s.image,
        views: s.views,
        chapterNumber: s.chapters ?? 0,
      };
    });
  },

  async getStoryBySlug(slug: string) {
    const res = await instance.get(`/story/with-author/${slug}`);
    res.data.author = res.data.authorId;
    res.data.id = res.data._id;
    return res.data;
  },

  async getMyStories(): Promise<Story[]> {
    const res = await instance.get<Story[]>("/story/my-stories");
    return res.data;
  },

  async createStory(data: FormData): Promise<Story> {
    const res = await instance.post("/story", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  async getStoriesWithFilter(params: {
    page: number;
    limit: number;
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
  }) {
    try {
      const response = await instance.get("/story/search", { params });
      return response?.data;
    } catch (error) {
      console.error("Error fetching stories with filter:", error);
      throw error;
    }
  },

  async getAllStory() {
    try {
      const response = await instance.get("/story");
      return response?.data;
    } catch (error) {
      console.error("Error fetching stories with filter:", error);
      throw error;
    }
  },
};

export default StoryService;
