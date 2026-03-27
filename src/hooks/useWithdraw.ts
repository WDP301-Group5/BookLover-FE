import { useQuery } from "@tanstack/react-query";
import WithdrawService from "../services/WithdrawService";

export const useAllWithdraws = (
  isLoggedIn: boolean,
  page: number = 1,
  limit: number = 20,
  status: string = "",
) => {
  return useQuery({
    queryKey: ["allWithdraws", page, limit, status],
    queryFn: () => WithdrawService.getAllWithdraws(page, limit, status),
    enabled: isLoggedIn,
  });
};
    
