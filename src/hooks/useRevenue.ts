import { useQuery } from "@tanstack/react-query";
import RevenueService from "../services/RevenueService";

export const useGeneralRevenue = (isLoggedIn: boolean) => {
    return useQuery({
        queryKey: ["generalRevenue"],
        queryFn: () => RevenueService.getGeneralInfor(),
        enabled: isLoggedIn,
    })
};

export const useChaptersRevenue = (isLoggedIn: boolean, page: number = 1, limit: number = 20, storyId: string = "", fromDate?: string | null, toDate?: string | null) => {
    return useQuery({
        queryKey: ["chaptersRevenue", page, limit, storyId, fromDate, toDate],
        queryFn: () => RevenueService.getAllRevenue(page, limit, storyId, fromDate, toDate),
        enabled: isLoggedIn,
    })
};

export const useAllPremiumStory = () => {
    return useQuery({
        queryKey: ["allPremiumStory"],
        queryFn: () => RevenueService.getAllPremiumStory(),
    });
};

export const useWithdrawHistory = (isLoggedIn: boolean, fromDate: string | null, toDate: string | null) => {
    return useQuery({
        queryKey: ["withdrawHistory", fromDate, toDate],
        queryFn: () => RevenueService.getWithdrawHistory(fromDate, toDate),
        enabled: isLoggedIn,
    });
}
