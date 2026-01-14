import {
    Divider,
    Image,
    Paper,
    Text,
} from "@mantine/core";
import {
    BookOpen,
    Eye,
    Star,
    UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PremiumIcon } from "../assets/index.ts";
import type { Story } from "../interfaces/Story.ts";

type StoryCardProps = {
    story: Story;
    type?: "home" | "search";
};

// Call
// const stories: Story[] = [
//     {
//         id: "1",
//         title: "Hành Trình Tu Tiên Bắt Đầu Hành Trình Tu Tiên Bắt Đầu",
//         slug: "hanh-trinh-tu-tien-bat-dau",
//         description:
//             "Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy. Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy. Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy.",
//         image: "https://tuanluupiano.com/wp-content/uploads/2026/01/hinh-anh-anime-nu-dep-nhat-11.jpg",
//         author: {
//             id: "a1",
//             name: "Mộng Thiên",
//             penName: "Thiên Mộng",
//         },
//         topics: ["Tiên Hiệp", "Huyền Huyễn"],
//         tags: [
//             "tu tiên",
//             "trưởng thành",
//             "phiêu lưu",
//         ],
//         status: "ongoing",
//         isFinish: true,
//         isPremium: true,
//         views: 125430,
//         stars: 4.6,
//         followers: 8420,
//         rates: 512,
//         chapters: 100,
//         createdAt: "2025-12-01T10:15:30Z",
//         updatedAt: "2026-01-10T08:20:00Z",
//     },
// ]
// {
//     stories.map((story) => (
//         <StoryCard
//             key={story.id}
//             story={story}
//             type="home"
//         />
//     ))
// }

const StoryCard = ({
    story,
    type = "home",
}: StoryCardProps) => {
    // TODO: check lại route
    const storyUrl = "/storys/" + story.slug;
    const navigate = useNavigate();
    if (type === "home") {
        return (
            <div
                className="w-full h-full max-w-48 shadow-[1px_2px_8px_2px_rgba(128,128,128,0.5)] rounded-sm cursor-pointer"
                onClick={() => navigate(storyUrl)}
            >
                <Paper
                    shadow="md"
                    radius="sm"
                    className="w-full h-full"
                >
                    <div className="relative hover:scale-105 transition-transform duration-300 ease-in-out">
                        <Image
                            radius="sm"
                            w={"100%"}
                            alt={story.title}
                            src={story.image}
                            className="mb-1 aspect-[3/4] object-cover shadow-lg shadow-gray-500/50"
                        />
                        {story.isPremium && (
                            <div className="absolute top-1 right-1 flex justify-center items-center bg-yellow-200 rounded-full">
                                <PremiumIcon className="w-8 h-8 rounded-full text-yellow-600" />
                            </div>
                        )}
                        <div className="absolute bottom-0 h-8 w-full bg-black rounded-b-sm opacity-50 flex justify-around items-center text-white text-xs">
                            <span className="flex justify-center items-center gap-1">
                                <Eye className="w-4" />
                                {story.views}
                            </span>
                            |
                            <span className="flex justify-center items-center gap-1">
                                <UserPlus className="w-4" />{" "}
                                {story.followers}
                            </span>
                        </div>
                    </div>
                    <div className="px-1 pb-1">
                        <Text
                            lineClamp={2}
                            fw={700}
                            className="h-12"
                        >
                            {story.title}
                        </Text>
                        <Text
                            lineClamp={1}
                            fw={500}
                            size="sm"
                        >
                            {story.author
                                ? `Tác giả: ${story.author.penName}`
                                : "Unknown Author"}
                        </Text>
                        <Text
                            lineClamp={2}
                            size="xs"
                            className="flex gap-1"
                        >
                            <span>
                                Thể loại:{" "}
                                {story.topics.join(
                                    ", ",
                                )}
                            </span>
                        </Text>
                    </div>
                </Paper>
            </div>
        );
    } else {
        return (
            <div
                className="w-full h-full shadow-[1px_1px_8px_2px_rgba(128,128,128,0.5)] inset-shadow-lg rounded-sm cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
                onClick={() => navigate(storyUrl)}
            >
                <Paper
                    shadow="md"
                    radius="sm"
                    className="w-full h-full p-2"
                >
                    <div className="flex gap-4 h-full">
                        <div className="relative h-full aspect-[3/4]">
                            <Image
                                radius="sm"
                                w={"100%"}
                                h={"100%"}
                                alt={story.title}
                                src={story.image}
                                className="mb-1 max-w-48 aspect-[3/4] object-cover shadow-lg shadow-gray-500/50"
                            />
                            {story.isPremium && (
                                <div className="absolute top-1 right-1 flex justify-center items-center bg-yellow-200 rounded-full">
                                    <PremiumIcon className="w-8 h-8 rounded-full text-yellow-600" />
                                </div>
                            )}
                        </div>
                        <div className="px-1 pb-1 mt-2 w-full overflow-hidden">
                            <Text
                                lineClamp={2}
                                fw={700}
                                size="md"
                                className="h-12"
                            >
                                {story.title}
                            </Text>
                            <Text
                                lineClamp={1}
                                fw={500}
                                size="sm"
                                mt={"sm"}
                            >
                                {story.author
                                    ? `Tác giả: ${story.author.penName}`
                                    : "Unknown Author"}
                                {story.isFinish && (
                                    <span className="bg-green-500 rounded-full ml-2 px-2 py-[2px] text-xs font-bold text-white">
                                        Đã Hoàn
                                        Thành
                                    </span>
                                )}
                            </Text>
                            <Text
                                lineClamp={1}
                                size="sm"
                                fw={200}
                            >
                                <span>
                                    Thể loại:{" "}
                                    {story.topics.join(
                                        ", ",
                                    )}
                                </span>
                            </Text>
                            {story?.tags && (
                                <Text
                                    lineClamp={1}
                                    size="sm"
                                    fw={200}
                                >
                                    <span>
                                        Tag:{" "}
                                        {story.tags.join(
                                            ", ",
                                        )}
                                    </span>
                                </Text>
                            )}
                            <div className="flex gap-1 h-8 font-extralight text-xs my-3">
                                <div className="flex flex-col justify-center items-center">
                                    <span className="flex justify-center items-center gap-1">
                                        <Eye className="w-4" />
                                        Xem
                                    </span>
                                    <span className="font-semibold">
                                        {
                                            story.views
                                        }
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    className="mx-2"
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <span className="flex justify-center items-center gap-1">
                                        <UserPlus className="w-4" />
                                        Theo dõi
                                    </span>
                                    <span className="font-semibold">
                                        {
                                            story.followers
                                        }
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    className="mx-2"
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <span className="flex justify-center items-center gap-1">
                                        <Star className="w-4" />
                                        Đánh giá
                                    </span>
                                    <span className="font-semibold">
                                        {story?.rates ||
                                            0}
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    className="mx-2"
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center">
                                    <span className="flex justify-center items-center gap-1">
                                        <BookOpen className="w-4" />
                                        Chương
                                    </span>
                                    <span className="font-semibold">
                                        {story?.chapters ||
                                            0}
                                    </span>
                                </div>
                            </div>
                            <Text
                                lineClamp={3}
                                size="sm"
                                className="min-h-15"
                            >
                                {
                                    story.description
                                }
                            </Text>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
};

export default StoryCard;
