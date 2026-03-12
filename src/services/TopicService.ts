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
};
