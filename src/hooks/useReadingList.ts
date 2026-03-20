import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReadingListService from "../services/ReadingListService";

export const useMyReadingLists = () => {
  return useQuery({
    queryKey: ["myReadingLists"],
    queryFn: () => ReadingListService.getMyReadingLists(),
  });
};

export const usePublicReadingLists = (userId: string) => {
  return useQuery({
    queryKey: ["publicReadingLists", userId],
    queryFn: () => ReadingListService.getPublicReadingLists(userId),
    enabled: !!userId,
  });
};

export const useReadingListById = (listId: string) => {
  return useQuery({
    queryKey: ["readingList", listId],
    queryFn: () => ReadingListService.getReadingListById(listId),
    enabled: !!listId,
  });
};

export const useCreateReadingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      isPublic?: boolean;
    }) => ReadingListService.createReadingList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReadingLists"] });
    },
  });
};

export const useUpdateReadingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      data,
    }: {
      listId: string;
      data: Record<string, any>;
    }) => ReadingListService.updateReadingList(listId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myReadingLists"] });
      queryClient.invalidateQueries({
        queryKey: ["readingList", variables.listId],
      });
    },
  });
};

export const useDeleteReadingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) =>
      ReadingListService.deleteReadingList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReadingLists"] });
    },
  });
};

export const useAddStoryToList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, storyId }: { listId: string; storyId: string }) =>
      ReadingListService.addStoryToList(listId, storyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["readingList", variables.listId],
      });
    },
  });
};

export const useRemoveStoryFromList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, storyId }: { listId: string; storyId: string }) =>
      ReadingListService.removeStoryFromList(listId, storyId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["readingList", variables.listId],
      });
    },
  });
};

export const useClearReadingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) =>
      ReadingListService.clearAllStoriesFromList(listId),
    onSuccess: (_, listId) => {
      queryClient.invalidateQueries({
        queryKey: ["readingList", listId],
      });
    },
  });
};

export const useSearchReadingLists = (query: string) => {
  return useQuery({
    queryKey: ["searchReadingLists", query],
    queryFn: () => ReadingListService.searchReadingLists(query),
    enabled: !!query,
  });
};
