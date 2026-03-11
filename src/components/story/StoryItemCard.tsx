// src/components/story/StoryItemCard.tsx
import { Image, Text } from "@mantine/core";
import { Eye, X } from "lucide-react";
import type { StoryItem } from "../../interfaces/Story.ts";
import { ShorterNumber } from "../../utils/index.ts";
import HistoryService from "../../services/HistoryService.ts";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "../../utils/notifications.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type StoryItemProps = {
	story: StoryItem;
	type?: "top" | "history"; // hiển thị ở bảng history hoặc bảng top các truyện
};

const StoryItemCard = ({ story, type }: StoryItemProps) => {

	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const handleDelete = async () => {
		if (!story.id) return;
		setLoading(true);
		const result = await HistoryService.deleteHistory(story.id);
		if (result && result?.success) {
			await queryClient.invalidateQueries({ queryKey: ["last3History"] });
			showSuccess("Xóa lịch sử thành công");
		};
		setLoading(false);
	};

	if (type === "top") {
		return (
			<div 
			className="w-full h-full min-w-[250px] max-w-[360px] max-h-20 flex gap-2 cursor-pointer"
			onClick={() => navigate(`/story/${story.slug}`)}
			>
				<Image
					src={story.image}
					alt={story.title}
					maw={"20%"}
					className="aspect-square"
				/>
				<div className="h-auto flex flex-col justify-between w-full">
					<div>
						<Text size="sm" lineClamp={1} fw={500} className="cursor-pointer">
							{story.title}
						</Text>
					</div>
					<div className="mt-auto flex justify-between text-xs text-gray-500">
						<span className="cursor-pointer">
							Chương {story.chapterNumber}
						</span>
						<span className="flex justify-center items-center gap-1">
							<Eye size={16} />
							{ShorterNumber(story.views)}
						</span>
					</div>
				</div>
			</div>
		);
	} else {
		return (// history
			<div className="w-full min-w-[250px] max-w-[360px] max-h-20 flex gap-2">
				<Image
					src={story?.storyId?.image}
					alt={story?.storyId?.title}
					maw={"20%"}
					className="aspect-square"
				/>
				<div className="h-full flex flex-col w-full">
					<Text size="sm" lineClamp={1} fw={500} className="cursor-pointer">
						{story?.storyId?.title}
					</Text>
					<div className="mt-2 flex justify-between font-medium text-xs text-gray-500">
						<span
							className="cursor-pointer hover:underline"
							onClick={() => navigate(`/truyen/${story?.storyId?.slug}/chuong/${story.chapterNumber}`)}
						>
							Đọc tiếp chương {story.chapterNumber}
						</span>
						<span
							className="flex justify-center items-center gap-1 text-red-500 font-semibold cursor-pointer"
							onClick={handleDelete}
						>
							{isLoading ? (<>Loading</>) : (<>
								<X strokeWidth={4} color="red" size={16} /> Xóa
							</>)}
						</span>
					</div>
				</div>
			</div>
		);
	}
};

export default StoryItemCard;
