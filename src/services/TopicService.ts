import type { Topic } from "../interfaces/Topic";
import { instance } from "../lib/axios";

export const TopicService = {
  async getTopics(): Promise<Topic[]> {
    const res = await instance.get("/topics");
    // Backend may return either an array or an object wrapper { success, data }
    const payload = res?.data;
    if (Array.isArray(payload)) return payload as Topic[];
    if (payload && Array.isArray(payload.data)) return payload.data as Topic[];
    return [];
  },

  async getAllTopics(): Promise<Topic[]> { // cả inactive
    try {
      const res = await instance.get("/topics/all-topics");
      console.log("service ", res.data)
      return res.data;
    } catch (error) {
      console.log("Error fetching all topics:", error);
      throw error;
    }
  },

  async getTopicById(id: string): Promise<Topic> {
    try {
      const res = await instance.get(`/topics/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error fetching topic by id:", error);
      throw error;
    }
  },

  async createTopic(data: FormData): Promise<Topic> {
    try {
      const res = await instance.post("/topics", data);
      return res.data;
    } catch (error) {
      console.log("Error create topic", error)
      throw error;
    }
  },

  async updateTopic(id: string, data: FormData): Promise<Topic> {
    try {
      const res = await instance.put(`/topics/${id}`, data);
      return res.data;
    } catch (error) {
      console.log("Error update topic", error)
      throw error;
    }
  },

  async deleteTopic(id: string): Promise<Topic> {
    try {
      const res = await instance.delete(`/topics/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error delete topic", error)
      throw error;
    }
  },

  async deleteManyTopics(ids: string[]): Promise<Topic> {
    try {
      const res = await instance.delete("/topics/many", { data: { ids } });
      return res.data;
    } catch (error) {
      console.log("Error delete topic", error)
      throw error;
    }
  },
};
