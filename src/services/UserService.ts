import axios from "axios";
import { instance } from "./../lib/axios";
import axiosClient from "../api/axiosClient";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: "admin" | "author" | "user";
    status: "active" | "inactive" | "banned";
    avatarURL?: string;
    vipLevel: number;
  };
}

export interface UpdateProfileRequest {
  fullName?: string;
  nickName?: string;
  penName?: string;
  bio?: string;
}

const UserService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await instance.post("/auth/login", credentials);
      return response.data;
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "An unknown error occurred";
    }
  },

  // async getUserProfile() {
  //   try {
  //     const response = await instance
  //       .get("/user/profile")
  //       .then((res) => res?.data)
  //       .catch((err) => {
  //         console.error("Error fetching user profile:", err);
  //         throw err;
  //       });
  //     return response?.data;
  //   } catch (error: unknown) {
  //     console.error("Error fetching user profile:", error);
  //     throw error;
  //   }
  // },

  async googleLogin(
    token: string,
    rememberMe: boolean = false,
  ): Promise<AuthResponse> {
    try {
      const response = await instance.post("/auth/google-login", {
        token,
        rememberMe,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error;
      }
      throw error instanceof Error
        ? error.message
        : "An unknown error occurred";
    }
  },

  async getProfile() {
    const res = await axiosClient.get("/user/profile");
    return res.data.data;
  },

  async updateProfile(data: {
    fullName?: string;
    nickName?: string;
    penName?: string;
    bio?: string;
    avatarFile?: File;
    backgroundFile?: File;
  }) {
    const formData = new FormData();

    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.nickName) formData.append("nickName", data.nickName);
    if (data.penName) formData.append("penName", data.penName);
    if (data.bio) formData.append("bio", data.bio);

    if (data.avatarFile) {
      formData.append("avatarURL", data.avatarFile);
    }

    if (data.backgroundFile) {
      formData.append("backgroundURL", data.backgroundFile);
    }

    const res = await axiosClient.put("/user/profile", formData);

    return res.data.data;
  }
};

export default UserService;
