import { useQuery } from "@tanstack/react-query";
import SubcriptionPlanService from "../services/SubcriptionPlanService";

export const useSubcriptionPlans = () => {
    return useQuery({
        queryKey: ['subscriptionPlans'],
        queryFn: () => SubcriptionPlanService.getSubcriptionPlans(),
    });
}