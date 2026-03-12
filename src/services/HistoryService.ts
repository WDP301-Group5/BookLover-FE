import { instance } from "../lib/axios";

const HistoryService = {
  async getLast3History() {
    try {
      const response = await instance
        .get("/user/history/last3")
        .then((res) => res?.data || [])
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

  async deleteHistory(id: string) {
    try {
      const response = await instance
        .delete(`/user/history/${id}`)
        .then((res) => res?.data || [])
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          throw err;
        });
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  async getReadingHistory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/user/history/reading", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res?.data || [])
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

  async getCommentHistory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/user/history/comment", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res?.data || [])
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

  async getReviewHistory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/user/history/review", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res?.data || [])
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

  async getRechargeHistory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/user/history/recharge", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res?.data || [])
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

  async getPurchaseHistory(page: number = 1, limit: number = 24) {
    try {
      const response = await instance
        .get("/user/history/purchase", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => res?.data || [])
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

export default HistoryService;
