import { useEffect, useState } from "react";
import ReviewService, {
  type ReviewItem,
  type ReviewStoryItem,
} from "../services/reviewService";

export const useReviewStories = (search: string = "", limit: number = 50) => {
  const [data, setData] = useState<ReviewStoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ReviewService.getReviewStories(search, limit);
      setData(response?.data?.items || []);
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi lấy danh sách truyện");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [search, limit]);

  return {
    data,
    loading,
    error,
    refetch: fetchStories,
  };
};

export const useReviews = ({
  sort = "newest",
  genre = "",
  search = "",
  page = 1,
  limit = 20,
}: {
  sort?: "newest" | "oldest";
  genre?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const [data, setData] = useState<ReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ReviewService.getReviews({
        sort,
        genre,
        search,
        page,
        limit,
      });

      setData(response?.data?.items || []);
      setTotal(response?.data?.total || 0);
    } catch (error: any) {
      setError(error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi lấy danh sách review");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sort, genre, search, page, limit]);

  return {
    data,
    total,
    loading,
    error,
    refetch: fetchReviews,
  };
};

export const useCreateReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createReview = async (payload: { storyId: string; content: string }) => {
    try {
      setLoading(true);
      setError("");

      const response = await ReviewService.createReview(payload);
      return response?.data || null;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi tạo review";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    loading,
    error,
  };
};