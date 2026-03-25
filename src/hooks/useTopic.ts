import { useQuery } from "@tanstack/react-query";
import { TopicService } from "../services/TopicService";

export const useTopics = () => {
	return useQuery({
		queryKey: ["topics"],
		queryFn: () => TopicService.getTopics(),
	});
};

export const useAllTopics = () => {
	return useQuery({
		queryKey: ["allTopics"],
		queryFn: () => TopicService.getAllTopics(),
	});
};

export const useTopic = (id: string) => {
	return useQuery({
		queryKey: ["topic", id],
		queryFn: () => TopicService.getTopicById(id),
	});
};
