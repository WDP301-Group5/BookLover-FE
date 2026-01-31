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
import type { Story } from "../../interfaces/Story.ts";
import { ShorterNumber } from "../../utils/index.ts";
import premiumSvg from "../../assets/premium.svg";

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
    const storyUrl = "/story/" + story.slug;
    const navigate = useNavigate();
    if (type === "home") {
        return (
            <div
                className="w-full h-full min-w-36 max-w-48 cursor-pointer border border-1 rounded"
                onClick={() => navigate(storyUrl)}
            >
                <Paper
                    shadow="md"
                    radius="sm"
                    className="w-full h-full"
                >
                    <div className="relative">
                        <Image
                            radius="sm"
                            w={"100%"}
                            alt={story.title}
                            src={story.image}
                            className="aspect-[3/4] object-cover"
                        />
                        {story.isPremium && (
                            <div className="absolute top-1 right-1 flex justify-center items-center bg-yellow-200 rounded-full">
                                <img src={premiumSvg} className="w-8 h-8 rounded-full" />
                            </div>
                        )}
                        <div className="absolute bottom-0 h-8 w-full bg-black rounded-b-sm opacity-50 flex justify-around items-center text-white text-xs">
                            <span className="flex justify-center items-center gap-1">
                                <Eye className="w-4" />
                                {ShorterNumber(story.views || 0)}
                            </span>
                            |
                            <span className="flex justify-center items-center gap-1">
                                <UserPlus className="w-4" />{" "}
                                {ShorterNumber(story.followers || 0)}
                            </span>
                        </div>
                    </div>
                    <div className="px-1 min-h-32 flex flex-col justify-evenly">
                        <Text
                            lineClamp={2}
                            fw={700}
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
                                {story.topics?.join(
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
                className="w-full h-full max-h-64 min-h-56 min-w-[480px] max-w-[640px] shadow-[1px_1px_8px_2px_rgba(128,128,128,0.5)] inset-shadow-lg rounded-sm cursor-pointer"
                onClick={() => navigate(storyUrl)}
            >
                <Paper
                    shadow="md"
                    radius="sm"
                    className="w-full h-full p-2"
                >
                    <div className="flex gap-2 h-full">
                        <div className="relative h-full aspect-[3/4] max-w-[30%]">
                            <Image
                                radius="sm"
                                w={"100%"}
                                h={"100%"}
                                alt={story.title}
                                src={story.image}
                                className="max-w-48 aspect-[3/4] object-cover shadow-lg shadow-gray-500/50"
                            />
                            {story.isPremium && (
                                <div className="absolute top-1 right-1 flex justify-center items-center bg-yellow-200 rounded-full">
                                    <img src={premiumSvg} className="w-8 h-8 rounded-full" />
                                </div>
                            )}
                        </div>
                        <div className="px-1 mt-2 w-full flex flex-col justify-between">
                            <Text
                                lineClamp={2}
                                fw={700}
                                size="md"
                            >
                                {story.title}
                            </Text>
                            <Text
                                lineClamp={1}
                                fw={600}
                                size="sm"
                            >
                                {story.author
                                    ? `Tác giả: ${story.author.penName}`
                                    : "Unknown Author"}
                                {story.isFinish && (
                                    <span className="rounded-full ml-2 px-2 py-[2px] text-xs font-bold text-white text-center align-middle">
                                        Đã Hoàn
                                        Thành
                                    </span>
                                )}
                            </Text>
                            <Text
                                lineClamp={1}
                                size="sm"
                                fw={500}
                            >
                                <span>
                                    Thể loại:{" "}
                                    {story.topics?.join(
                                        ", ",
                                    )}
                                </span>
                            </Text>
                            <div className="flex gap-1 font-medium text-xs">
                                <div className="flex flex-col justify-center items-center w-[23%]">
                                    <span className="flex justify-center items-center gap-1">
                                        <Eye className="w-4" />
                                        Xem
                                    </span>
                                    <span className="font-semibold">
                                        {
                                            ShorterNumber(
                                                story.views,
                                            )
                                        }
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center w-[23%]">
                                    <span className="flex justify-center items-center gap-1">
                                        <UserPlus className="w-4" />
                                        Theo dõi
                                    </span>
                                    <span className="font-semibold">
                                        {
                                            ShorterNumber(
                                                story.followers,
                                            )
                                        }
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center w-[23%]">
                                    <span className="flex justify-center items-center gap-1">
                                        <Star className="w-4" />
                                        Đánh giá
                                    </span>
                                    <span className="font-semibold">
                                        {ShorterNumber(story.rates || 0)}
                                    </span>
                                </div>
                                <Divider
                                    size={"sm"}
                                    color="gray.6"
                                    orientation="vertical"
                                />
                                <div className="flex flex-col justify-center items-center w-[23%]">
                                    <span className="flex justify-center items-center gap-1">
                                        <BookOpen className="w-4" />
                                        Chương
                                    </span>
                                    <span className="font-semibold">
                                        {ShorterNumber(story?.chapters || 0)}
                                    </span>
                                </div>
                            </div>
                            <Text
                                lineClamp={2}
                                size="sm"
                                className="min-h-10"
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
