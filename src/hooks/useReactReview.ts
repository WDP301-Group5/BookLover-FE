import { useMutation, useQuery } from "@tanstack/react-query";
import ReactReviewService, {
  type ReactReviewTypeValue,
} from "../services/ReactReviewService";

export const useUserReactReviews = (reviewIds: string[]) => {
  return useQuery({
    queryKey: ["userReactReviews", reviewIds],
    queryFn: () => ReactReviewService.getUserReactReviews(reviewIds),
    enabled: !!reviewIds.length, 
  });
};

export const useReactReview = () => {
  return useMutation({
    mutationFn: ({
      reviewId,
      react,
    }: {
      reviewId: string;
      react: ReactReviewTypeValue;
    }) => ReactReviewService.userReactReview(reviewId, react),
  });
};