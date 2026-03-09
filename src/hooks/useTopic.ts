import { useQuery } from "@tanstack/react-query";
import { TopicService } from "../services/TopicService";

export const useTopics = () => {
	return useQuery({
		queryKey: ["topics"],
		queryFn: () => TopicService.getTopics(),
	});
};
