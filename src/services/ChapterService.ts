import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9999";

export interface Chapter {
  _id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  contentURL: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export const ChapterService = {
  getChaptersByStory(storyId: string) {
    return axios.get<Chapter[]>(
      `${API_BASE_URL}/api/stories/${storyId}/chapters`,
    );
  },

  getChapterDetail(storyId: string, chapterNumber: number) {
    return axios.get<Chapter>(
      `${API_BASE_URL}/api/stories/${storyId}/chapters/${chapterNumber}`,
    );
  },
};
