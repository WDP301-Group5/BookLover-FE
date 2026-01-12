import { useQuery } from "@tanstack/react-query"
import UserService from "../services/UserService";

export const useUser = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: () => UserService.getUserProfile(),
    });

}