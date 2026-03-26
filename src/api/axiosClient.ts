import axios from "axios";
import { handle401Unauthorized } from "../utils/authHandler";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Perform complete logout (clear localStorage & Zustand store)
      await handle401Unauthorized();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
