// src/hooks/useTopic.ts
import { useQuery } from "@tanstack/react-query";
import { instance } from "../lib/axios";

export const useTopics = () => {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const res = await instance.get("/topics"); // BE route trả về tất cả topics
      return res.data.topics;
    },
  });
};