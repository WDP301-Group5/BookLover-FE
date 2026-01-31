import { useQuery } from "@tanstack/react-query";
import HistoryService from "../services/HistoryService";

export const useLast3History = () => {
  return useQuery({
    queryKey: ["last3History"],
    queryFn: () => HistoryService.getLast3History(),
  });
};
