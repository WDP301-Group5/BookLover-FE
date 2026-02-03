import { useMutation } from "@tanstack/react-query";
import PurchaseService from "../services/PurchaseService";

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: ({ amount, description }: { amount: number; description: string }) =>
            PurchaseService.createOrder(amount, description),
        retry: false,
    });
};
