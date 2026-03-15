import { instance } from "../lib/axios";

export interface SearchStoriesParams {
  q?: string;
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  sortBy?: string;
}

export interface SearchProfilesParams {
  q?: string;
  limit?: number;
}

const SearchService = {
  async searchStories(params: SearchStoriesParams) {
    try {
      const response = await instance
        .get("/search/stories", { params })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error searching stories:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error searching stories:", error);
      throw error;
    }
  },

  async searchProfiles(params: SearchProfilesParams) {
    try {
      const response = await instance
        .get("/search/profiles", { params })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error searching profiles:", err);
          throw err;
        });

      return response?.data;
    } catch (error) {
      console.error("Error searching profiles:", error);
      throw error;
    }
  },
};

export default SearchService;