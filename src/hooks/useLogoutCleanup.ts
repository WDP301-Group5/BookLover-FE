import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/useUserStore";

/**
 * Hook để cleanup React Query cache khi user logout
 * Xóa tất cả reading history, comment history, review history, etc.
 */
export const useLogoutCleanup = () => {
  const queryClient = useQueryClient();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      // Xóa tất cả history-related queries
      queryClient.removeQueries({ queryKey: ["readingHistory"] });
      queryClient.removeQueries({ queryKey: ["last3History"] });
      queryClient.removeQueries({ queryKey: ["commentHistory"] });
      queryClient.removeQueries({ queryKey: ["reviewHistory"] });
      queryClient.removeQueries({ queryKey: ["rechargeHistory"] });
      queryClient.removeQueries({ queryKey: ["purchaseHistory"] });
    }
  }, [isLoggedIn, queryClient]);
};
