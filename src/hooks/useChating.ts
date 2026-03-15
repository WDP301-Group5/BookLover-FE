import { useQuery } from "@tanstack/react-query";
import ChatingService from "../services/ChatingService";

export const useListChatingUser = () => {
    return useQuery({
        queryKey: ["listChatingUser"],
        queryFn: () => ChatingService.getListChatingUser(),
    })
};

export const useChatingContent = (conversationId: string, lastMessageTime: string) => {
    return useQuery({
        queryKey: ["chatingContent", conversationId, lastMessageTime],
        queryFn: () => ChatingService.getChatingContent(conversationId, lastMessageTime),
    })
};

export const useSearchUser = (query: string) => {
    return useQuery({
        queryKey: ["searchUser", query],
        queryFn: () => ChatingService.searchUser(query),
    })
};
