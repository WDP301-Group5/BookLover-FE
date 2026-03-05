import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { instance } from './../lib/axios';

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
    role: 'admin' | 'author' | 'user';
    status: 'active' | 'inactive' | 'banned';
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

export interface UpdateProfileRequest {
  fullName?: string;
  nickName?: string;
  penName?: string;
  bio?: string;
}

const UserService = {
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await instance.post('/auth/register', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Lỗi đăng ký:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : 'Có lỗi không xác định xảy ra';
    }
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const response = await instance.get('/auth/verify-email', {
        params: { token },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Lỗi xác thực email:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : 'Có lỗi không xác định xảy ra';
    }
  },

  async resendVerificationEmail(
    email: string,
  ): Promise<ResendVerificationResponse> {
    try {
      const response = await instance.post('/auth/resend-verification', {
        email,
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Lỗi gửi lại email xác thực:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : 'Có lỗi không xác định xảy ra';
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await instance.post('/auth/login', credentials);
      // Extract data from wrapper
      const { success, data } = response.data;
      return {
        success,
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error: unknown) {
      console.error('Lỗi đăng nhập:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error.message;
      }
      throw error instanceof Error
        ? error.message
        : 'Có lỗi không xác định xảy ra';
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
      const response = await instance.post('/auth/google-login', {
        token,
        rememberMe,
      });
      // Extract data from wrapper
      const { success, data } = response.data;
      return {
        success,
        accessToken: data.accessToken,
        user: data.user,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response?.data || error;
      }
      throw error instanceof Error
        ? error.message
        : 'Có lỗi không xác định xảy ra';
    }
  },

  async getProfile() {
    const res = await axiosClient.get('/user/profile');
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

    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.nickName) formData.append('nickName', data.nickName);
    if (data.penName) formData.append('penName', data.penName);
    if (data.bio) formData.append('bio', data.bio);

    if (data.avatarFile) {
      formData.append('avatarURL', data.avatarFile);
    }

    if (data.backgroundFile) {
      formData.append('backgroundURL', data.backgroundFile);
    }

    const res = await axiosClient.put('/user/profile', formData);

    return res.data.data;
  },
};

export default UserService;
