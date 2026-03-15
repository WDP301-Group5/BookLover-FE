import { useEffect, useState } from "react";
import RankingService, {
  type RankingAuthorItem,
  type RankingStoryItem,
  type RankingUserItem,
} from "../services/rankingService";

export const useTopStoriesRanking = (
  type: "views" | "followers",
  limit: number = 15,
) => {
  const [data, setData] = useState<RankingStoryItem[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await RankingService.getTopStories(type, limit);

      setData(response?.data?.items || []);
      setNote(response?.data?.note || "");
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra khi lấy bảng xếp hạng truyện");
      setData([]);
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [type, limit]);

  return {
    data,
    note,
    loading,
    error,
    refetch: fetchRanking,
  };
};

export const useTopAuthorsRanking = (
  type: "followers" | "stories",
  limit: number = 30,
) => {
  const [data, setData] = useState<RankingAuthorItem[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await RankingService.getTopAuthors(type, limit);

      setData(response?.data?.items || []);
      setNote(response?.data?.note || "");
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra khi lấy bảng xếp hạng tác giả");
      setData([]);
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [type, limit]);

  return {
    data,
    note,
    loading,
    error,
    refetch: fetchRanking,
  };
};

export const useTopUsersRanking = (
  type: "comments" | "spent",
  limit: number = 30,
) => {
  const [data, setData] = useState<RankingUserItem[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await RankingService.getTopUsers(type, limit);

      setData(response?.data?.items || []);
      setNote(response?.data?.note || "");
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra khi lấy bảng xếp hạng người đọc");
      setData([]);
      setNote("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [type, limit]);

  return {
    data,
    note,
    loading,
    error,
    refetch: fetchRanking,
  };
};