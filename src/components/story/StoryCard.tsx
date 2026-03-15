// src/components/story/StoryCard.tsx
import { Divider, Image, Paper, Text } from "@mantine/core";
import { BookOpen, Eye, Star, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import premiumSvg from "../../assets/premium.svg";
import type { Story } from "../../interfaces/Story.ts";
import { ShorterNumber } from "../../utils/index.ts";

type StoryCardProps = {
  story: Story;
  type?: "home" | "search";
};

const StoryCard = ({ story, type = "home" }: StoryCardProps) => {
  const storyUrl = "/story/" + story.slug;
  const navigate = useNavigate();

  if (type === "home") {
    return (
      <div
        className="w-full min-w-36 max-w-48 cursor-pointer border border-1 rounded"
        onClick={() => navigate(storyUrl)}
      >
        <Paper shadow="md" radius="sm" className="w-full">
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
          <div className="px-1 min-h-32 flex flex-col justify-start gap-1 mt-1">
            <Text lineClamp={2} fw={700}>
              {story.title}
            </Text>
            <Text lineClamp={1} fw={500} size="sm">
              {story.author
                ? `Tác giả: ${story.author.penName}`
                : "Unknown Author"}
            </Text>
            <Text lineClamp={2} size="xs">
              Thể loại: {story.topics?.join(", ")}
            </Text>
          </div>
        </Paper>
      </div>
    );
  } else {
    // SEARCH CARD
    return (
      <div
        className="w-full cursor-pointer shadow-[1px_1px_8px_2px_rgba(128,128,128,0.5)] rounded-sm"
        onClick={() => navigate(storyUrl)}
      >
        <Paper shadow="md" radius="sm" className="w-full p-2">
          <div className="flex gap-2">
            {/* IMAGE */}
            <div className="relative aspect-[3/4] max-w-[22%] flex-shrink-0">
              <Image
                radius="sm"
                w={"100%"}
                h={"100%"}
                alt={story.title}
                src={story.image}
                className="object-cover shadow-lg shadow-gray-500/50"
              />
              {story.isPremium && (
                <div className="absolute top-1 right-1 flex justify-center items-center bg-yellow-200 rounded-full">
                  <img src={premiumSvg} className="w-8 h-8 rounded-full" />
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-start gap-1 w-full mt-1">
              <Text lineClamp={2} fw={700} size="md">
                {story.title}
              </Text>
              <Text lineClamp={1} fw={600} size="sm">
                {story.author
                  ? `Tác giả: ${story.author.penName}`
                  : "Unknown Author"}
                {story.isFinish && (
                  <span className="rounded-full ml-2 px-2 py-[2px] text-xs font-bold text-white text-center">
                    Đã Hoàn Thành
                  </span>
                )}
              </Text>
              <Text lineClamp={1} size="sm" fw={500}>
                Thể loại: {story.topics?.join(", ")}
              </Text>

              {/* STATS */}
              <div className="flex gap-1 text-xs">
                <div className="flex flex-col items-center w-[23%]">
                  <span className="flex justify-center items-center gap-1">
                    <Eye className="w-4" /> Xem
                  </span>
                  <span className="font-semibold">
                    {ShorterNumber(story.views)}
                  </span>
                </div>
                <Divider size="sm" color="gray.6" orientation="vertical" />
                <div className="flex flex-col items-center w-[23%]">
                  <span className="flex justify-center items-center gap-1">
                    <UserPlus className="w-4" /> Theo dõi
                  </span>
                  <span className="font-semibold">
                    {ShorterNumber(story.followers)}
                  </span>
                </div>
                <Divider size="sm" color="gray.6" orientation="vertical" />
                <div className="flex flex-col items-center w-[23%]">
                  <span className="flex justify-center items-center gap-1">
                    <Star className="w-4" /> Đánh giá
                  </span>
                  <span className="font-semibold">
                    {ShorterNumber(story.rates || 0)}
                  </span>
                </div>
                <Divider size="sm" color="gray.6" orientation="vertical" />
                <div className="flex flex-col items-center w-[23%]">
                  <span className="flex justify-center items-center gap-1">
                    <BookOpen className="w-4" /> Chương
                  </span>
                  <span className="font-semibold">
                    {ShorterNumber(story?.chapters || 0)}
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <Text lineClamp={2} size="sm" className="mt-99">
                  {story.description}
                </Text>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
};

export default StoryCard;
