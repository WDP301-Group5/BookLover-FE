// src/services/StoryPageService.ts

import type { Story, StoryItem } from "../interfaces/Story";
import { instance } from "../lib/axios";

export const StoryPageService = {
	async getStories(): Promise<StoryItem[]> {
		const res = await instance.get<Story[]>("/story");
		console.log(res.data);
		return res.data.map((s) => {
			return {
				id: s.id,
				title: s.title,
				slug: s.slug,
				image: s.image,
				views: s.views,
				chapterNumber: s.chapters ?? 0,
			};
		});
	},

	async getStoryBySlug(slug: string): Promise<Story> {
		const res = await instance.get(`/story/${slug}`);
		res.data.topics = res.data.topics.map((topic: { name: string }) => {
			return topic?.name || "";
		});
		return res.data as Story;
	},

	async createStory(data: FormData): Promise<Story> {
		const res = await instance.post("/story", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data;
	},

	async getMyStories(): Promise<Story[]> {
		const res = await instance.get<Story[]>("/story/my-stories");
		return res.data;
	},
};
