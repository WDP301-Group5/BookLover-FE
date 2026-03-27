// src/lib/axios.ts
import axios from "axios";
import { BASE_URL } from "../constants";
import { isTokenExpired } from "../utils/token";
import { handle401Unauthorized } from "../utils/authHandler";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.",
      );
      // Perform complete logout
      await handle401Unauthorized();
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
