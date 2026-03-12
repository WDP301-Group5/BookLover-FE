import { useQuery } from "@tanstack/react-query";
import HistoryService from "../services/HistoryService";

export const useLast3History = () => {
  return useQuery({
    queryKey: ["last3History"],
    queryFn: () => HistoryService.getLast3History(),
  });
};

export const useReadingHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["readingHistory", page, limit],
    queryFn: () => HistoryService.getReadingHistory(page, limit),
  });
};

export const useCommentHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["commentHistory", page, limit],
    queryFn: () => HistoryService.getCommentHistory(page, limit),
  });
};

export const useReviewHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["reviewHistory", page, limit],
    queryFn: () => HistoryService.getReviewHistory(page, limit),
  });
};

export const useRechargeHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["rechargeHistory", page, limit],
    queryFn: () => HistoryService.getRechargeHistory(page, limit),
  });
};

export const usePurchaseHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["purchaseHistory", page, limit],
    queryFn: () => HistoryService.getPurchaseHistory(page, limit),
  });
};
