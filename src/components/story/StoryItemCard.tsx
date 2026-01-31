import { Image, Text } from "@mantine/core";
import type { StoryItem } from "../../interfaces/Story.ts";
import { ShorterNumber } from "../../utils/index.ts";
import { Eye, X } from "lucide-react";

type StoryItemProps = {
    story: StoryItem,
    type?: "top" | "history", // hiển thị ở bảng history hoặc bảng top các truyện
    deleteFunc?: () => void // có thể tự viết hàm ở đây thay vì truyền vào từ ngoài
}

const StoryItemCard = ({ story, type, deleteFunc }: StoryItemProps) => {

    if (type === "top") {
        return (
            <div className="w-full h-full min-w-[250px] max-w-[360px] max-h-20 flex gap-2">
                <Image
                    src={story.image}
                    alt={story.title}
                    maw={"20%"}
                    className="aspect-square"
                />
                <div className="h-auto flex flex-col justify-between">
                    <div>
                        <Text
                            size="sm"
                            lineClamp={1}
                            fw={500}
                            className="cursor-pointer"
                        >
                            {story.title}
                        </Text>
                    </div>
                    <div
                        className="mt-auto flex justify-between text-xs text-gray-500"
                    >
                        <span className="cursor-pointer mr-4">Chương {story.chapterNumber}</span>
                        <span className="flex justify-center items-center gap-1">
                            <Eye size={16} />
                            {ShorterNumber(story.views)}
                        </span>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full min-w-[250px] max-w-[360px] max-h-20 flex gap-2">
                <Image
                    src={story.image}
                    alt={story.title}
                    maw={"20%"}
                    className="aspect-square"
                />
                <div className="h-full flex flex-col w-full">
                    <Text
                        size="sm"
                        lineClamp={1}
                        fw={500}
                        className="cursor-pointer"
                    >
                        {story.title}
                    </Text>
                    <div
                        className="mt-2 flex justify-between font-medium text-xs text-gray-500"
                    >
                        <span className="cursor-pointer">Đọc tiếp chương {story.chapterNumber}</span>
                        <span
                        className="flex justify-center items-center gap-1 text-red-500 font-semibold cursor-pointer"
                        onClick={deleteFunc}
                        >
                            <X strokeWidth={4} color="red" size={16} />
                            Xóa
                        </span>
                    </div>
                </div>
            </div>
        );
    }
};

export default StoryItemCard;