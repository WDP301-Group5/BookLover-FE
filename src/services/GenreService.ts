// src/services/GenreService.ts
import type { Genre } from "../interfaces/genre";
import { instance as axios } from "../lib/axios";

export const GenreService = {
  getAll: async (): Promise<Genre[]> => {
    const response = await axios.get("/genres/all-genres");
    return response.data.genres; 
  },

  getById: async (id: string): Promise<Genre> => {
    const response = await axios.get(`/genres/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Genre> => {
    const response = await axios.post("/genres", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, data: FormData): Promise<Genre> => {
    const response = await axios.put(`/genres/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/genres/${id}`);
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await axios.post("/genres/delete-many", { ids });
  },
};