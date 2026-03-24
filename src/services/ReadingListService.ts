import { instance } from "../lib/axios";

export interface IReadingList {
  _id?: string;
  id?: string;
  userId?: string;
  name: string;
  stories?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ReadingListService = {
  createReadingList: async (data: { name: string }) => {
    const response = await instance.post("/reading-list/create", data);
    return response.data.data;
  },

  getMyReadingLists: async () => {
    const response = await instance.get("/reading-list/my-lists");
    return response.data.data;
  },

  getPublicReadingLists: async (userId: string) => {
    const response = await instance.get(`/reading-list/${userId}/lists`);
    return response.data.data;
  },

  getReadingListById: async (listId: string) => {
    const response = await instance.get(`/reading-list/list/${listId}`);
    return response.data.data;
  },

  updateReadingList: async (listId: string, data: Partial<IReadingList>) => {
    const response = await instance.put(`/reading-list/list/${listId}`, data);
    return response.data.data;
  },

  deleteReadingList: async (listId: string) => {
    const response = await instance.delete(`/reading-list/list/${listId}`);
    return response.data;
  },

  addStoryToList: async (listId: string, storyId: string) => {
    const response = await instance.post(
      `/reading-list/list/${listId}/add-story`,
      {
        storyId,
      },
    );
    return response.data.data;
  },

  removeStoryFromList: async (listId: string, storyId: string) => {
    const response = await instance.post(
      `/reading-list/list/${listId}/remove-story`,
      {
        storyId,
      },
    );
    return response.data.data;
  },

  clearAllStoriesFromList: async (listId: string) => {
    const response = await instance.post(
      `/reading-list/list/${listId}/clear-stories`,
    );
    return response.data.data;
  },

  searchReadingLists: async (query: string) => {
    const response = await instance.get("/reading-list/search", {
      params: { query },
    });
    return response.data.data;
  },
};

export default ReadingListService;
