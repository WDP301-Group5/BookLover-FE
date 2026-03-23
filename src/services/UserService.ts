import axios from "axios";
import axiosClient from "../api/axiosClient";
import { instance } from "./../lib/axios";

export interface LoginCredentials {
  account: string;
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

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  nextResendIn?: number;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
  nextResendIn?: number;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  nickName?: string;
  penName?: string;
  bio?: string;
}

export interface UserRelationship {
  amIFollowing: boolean;
  followsMe: boolean;
  isMutual: boolean;
  isSelf?: boolean;
  notificationEnabled?: boolean;
}

export interface AuthorPublicProfile {
  _id: string;
  id?: string;
  username?: string;
  fullName: string;
  nickName?: string;
  penName?: string;
  bio?: string;
  avatarURL?: string;
  backgroundURL?: string;
  vipLevel?: number;
  followersCount: number;
  followingCount?: number;
  storiesCount: number;
  totalViews?: number;
  totalVotes?: number;
  isSelf?: boolean;
  stories?: AuthorStory[];
  relationship?: UserRelationship;
}

export interface AuthorStory {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description?: string;
  views: number;
  stars: number;
  rates: number;
  followers: number;
  isPremium: boolean;
  isFinish: boolean;
  chapterNumber: number;
}

export interface FollowListResponse {
  followers?: AuthorPublicProfile[];
  following?: AuthorPublicProfile[];
  total: number;
  page: number;
  pageSize: number;
}

const UserService = {
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await instance.post("/auth/register", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi đăng ký:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await instance.get("/auth/verify-email", {
        params: { token },
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi xác thực email:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async resendVerificationEmail(
    email: string,
  ): Promise<ResendVerificationResponse> {
    try {
      const response = await instance.post("/auth/resend-verification", {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi gửi lại email xác thực:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await instance.post("/auth/login", credentials);
      // Extract data from wrapper
      const { success, data, message } = response.data;

      if (!data || !data.accessToken) {
        throw new Error(
          message || "Không nhận được thông tin đăng nhập từ server",
        );
      }

      return {
        success,
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as any;
        throw new Error(errorData?.message || "Đăng nhập thất bại");
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
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
      // Extract data from wrapper
      const { success, data, message } = response.data;

      if (!data || !data.accessToken) {
        throw new Error(
          message || "Không nhận được thông tin đăng nhập từ server",
        );
      }

      return {
        success,
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as any;
        throw new Error(errorData?.message || "Đăng nhập Google thất bại");
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async getProfile() {
    const res = await axiosClient.get("/user/profile");
    return res.data.data;
  },

  async updateProfile(data: {
    fullName?: string;
    username?: string;
    nickName?: string;
    penName?: string;
    bio?: string;
    avatarFile?: File;
    backgroundFile?: File;
  }) {
    const formData = new FormData();

    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.username) formData.append("username", data.username);
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
  },

  async requestPasswordReset(
    email: string,
  ): Promise<PasswordResetRequestResponse> {
    try {
      const response = await instance.post("/auth/password-reset-request", {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi yêu cầu đặt lại mật khẩu:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async confirmPasswordReset(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<PasswordResetConfirmResponse> {
    try {
      const response = await instance.post("/auth/password-reset-confirm", {
        token,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi xác nhận đặt lại mật khẩu:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async getPublicProfile(authorId: string): Promise<{
    profile: AuthorPublicProfile;
    stories: AuthorStory[];
    relationship: UserRelationship;
  }> {
    const res = await axiosClient.get(`/user/${authorId}/profile`);
    return res.data.data;
  },

  async toggleFollow(authorId: string): Promise<{
    status: "follow" | "unfollow";
    relationship: UserRelationship;
  }> {
    const res = await axiosClient.post(`/user/${authorId}/follow`);
    return res.data.data;
  },

  async getFollowers(
    authorId: string,
    page = 1,
  ): Promise<{
    followers: AuthorPublicProfile[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const res = await axiosClient.get(`/user/${authorId}/followers`, {
      params: { page },
    });
    return res.data.data;
  },

  async getFollowing(
    authorId: string,
    page = 1,
  ): Promise<{
    following: AuthorPublicProfile[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const res = await axiosClient.get(`/user/${authorId}/following`, {
      params: { page },
    });
    return res.data.data;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosClient.post("/user/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : "Có lỗi không xác định xảy ra";
    }
  },

  async searchUsers(query: string): Promise<AuthorPublicProfile[]> {
    if (!query || query.trim() === "") return [];

    try {
      const res = await axiosClient.get("/user/search", {
        params: { q: query },
      });

      const mapped: AuthorPublicProfile[] = res.data.data.map((u: any) => ({
        _id: u.id || u._id,
        id: u.id || u._id,
        username: u.username,
        penName: u.penName,
        fullName: u.fullName,
        nickName: u.nickName,
        bio: u.bio,
        avatarURL: u.avatarURL || "/default-avatar.png",
        backgroundURL: u.backgroundURL || "",
        followersCount: u.followersCount || 0,
        followingCount: u.followingCount || 0,
        storiesCount: u.storiesCount || 0,
        vipLevel: u.vipLevel || 0,
        relationship: {
          amIFollowing: !!u.relationship?.amIFollowing,
          followsMe: !!u.relationship?.followsMe,
          isMutual: !!u.relationship?.isMutual,
          isSelf: !!u.relationship?.isSelf,
          notificationEnabled: !!u.relationship?.notificationEnabled,
        },
      }));

      return mapped;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
};

export default UserService;
