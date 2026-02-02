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
  async getTop10Story(type: "m" | "w" | "d" = "m") {// month, week, day
    try {
      const response = await instance
        .get("/story/top10", {
            params: {
                type: type
            }
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
};

export default StoryService;
