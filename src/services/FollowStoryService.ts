import { instance } from "../lib/axios";

const FollowStoryService = {
  async checkUserFollowStory(storyId: string) {
    if (!storyId || !String(storyId).trim()) return null;
    try {
      const response = await instance
        .get(`/follow/story/check/${storyId}`)
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error check user follow story:", err);
          throw err;
        });
      return response?.data;
    } catch (error) {
      console.error("Error check user follow story:", error);
      throw error;
    }
  },

  async changeStatusFollowStory(storyId: string, status: "follow" | "unfollow" | "unsend") {
    if (
      !storyId ||
      !String(storyId).trim() ||
      status === undefined ||
      status === null
    )
      return null;
    try {
      const response = await instance
        .post(`/follow/story/${storyId}`, { status })
        .then((res) => res || [])
        .catch((err) => {
          console.error("Error change status follow story:", err);
          throw err;
        });
      return response?.data;
    } catch (error) {
      console.error("Error change status follow story:", error);
      throw error;
    }
  },

  async getMyFollowedStories() {
    try {
      const response = await instance.get(`/follow/story/my-following`);
      return response?.data || [];
    } catch (error) {
      console.error("Error get my followed stories:", error);
      throw error;
    }
  },
};

export default FollowStoryService;
