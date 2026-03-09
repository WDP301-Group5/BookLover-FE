import type { Topic } from "../interfaces/Topic";
import { instance } from "../lib/axios";

export const TopicService = {
	async getTopics(): Promise<Topic[]> {
		const res = await instance.get<Topic[]>("/topics");
		return res.data;
	},
};
