// src/lib/axios.ts
import axios from "axios";
import { BASE_URL } from "../constants";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
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
    (error) => {
        if (error.response && error.response.status === 401) {
            // xóa token khỏi localStorage
            localStorage.removeItem("token");
            console.error("Unauthorized! Redirecting to login...");
            window.location.href = "/login";
        }
        if (error.response && error.response.status === 403) {
            console.error("Forbidden! You don't have permission to access this resource.");
            history.back();
        }
        return Promise.reject(error);
    },
);