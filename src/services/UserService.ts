import { instance } from "./../lib/axios";

const UserService = {
  async getUserProfile() {
    try {
      const response = await instance
        .get("/user/profile")
        .then((res) => res?.data)
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

export default UserService;
