import axios from "axios";
import { instance } from "./../lib/axios";
import axiosClient from "../api/axiosClient";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  captchaToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
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

  async updateProfile(data: UpdateProfileRequest) {
    const res = await axiosClient.put("/user/profile", data);
    return res.data.data;
  },
};

export default UserService;
