// src/hooks/useSearch.ts
import { useEffect, useState } from "react";
import SearchService from "../services/SearchService";

interface UseSearchStoriesParams {
  q: string;
  page: number;
  limit: number;
  status?: string;
  category?: string;
  sortBy?: string;
}

export const useSearchStories = ({
  q,
  page,
  limit,
  status,
  category,
  sortBy,
}: UseSearchStoriesParams) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await SearchService.searchStories({
        q,
        page,
        limit,
        status,
        category,
        sortBy,
      });

      setData(response?.data || response);
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra khi tìm truyện");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [q, page, limit, status, category, sortBy]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStories,
  };
};

export const useSearchProfiles = (q: string, limit: number = 20) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfiles = async () => {
    try {
      if (!q.trim()) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError("");

      const response = await SearchService.searchProfiles({
        q,
        limit,
      });

      setData(response?.data || response || []);
    } catch (error: any) {
      setError(error?.message || "Có lỗi xảy ra khi tìm hồ sơ");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [q, limit]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProfiles,
  };
};