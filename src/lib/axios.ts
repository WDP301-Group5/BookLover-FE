// src/lib/axios.ts
import axios from "axios";
import { BASE_URL } from "../constants";
import { isTokenExpired } from "../utils/token";

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
	(error) => {
		if (error.response && error.response.status === 403) {
			console.error(
				"Forbidden! You don't have permission to access this resource.",
			);
			if (navigate) {
				navigate(-1);
			}
		}
		return Promise.reject(error);
	},
);
