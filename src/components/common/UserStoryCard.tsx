import { Image, Text } from "@mantine/core";
import { Eye, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShorterNumber } from "../../utils";

type TopicItem = {
  _id?: string;
  name?: string;
  description?: string;
};

type AuthorItem = {
  _id?: string;
  fullName?: string;
  nickName?: string;
  penName?: string;
  avatarURL?: string;
};

type UserStoryCardProps = {
  story: {
    _id?: string;
    id?: string;
    slug: string;
    title: string;
    image: string;
    description?: string;
    views?: number;
    followers?: number;
    authorId?: string | AuthorItem;
    topics?: Array<string | TopicItem>;
  };
};

const UserStoryCard = ({ story }: UserStoryCardProps) => {
  const navigate = useNavigate();

  const author =
    typeof story.authorId === "object" && story.authorId
      ? story.authorId.penName ||
        story.authorId.nickName ||
        story.authorId.fullName ||
        "Unknown Author"
      : "Unknown Author";

  const topicNames = Array.isArray(story.topics)
    ? story.topics
        .map((topic) => (typeof topic === "string" ? topic : topic?.name))
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div
      className="w-[180px] min-h-[290px] rounded-md overflow-hidden cursor-pointer border border-gray-300 bg-white text-gray-900 transition hover:shadow-md dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
      onClick={() => navigate(`/story/${story.slug}`)}
    >
      <div className="relative">
        <Image
          src={story.image}
          alt={story.title}
          className="w-full h-[190px] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-black/50 text-white text-xs flex items-center justify-around">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {ShorterNumber(story.views || 0)}
          </span>
          <span className="flex items-center gap-1">
            <UserPlus size={14} />
            {ShorterNumber(story.followers || 0)}
          </span>
        </div>
      </div>

      <div className="p-2 flex flex-col gap-1">
        <Text fw={700} lineClamp={1} className="text-blue-600 dark:text-blue-400">
          {story.title}
        </Text>

        <Text size="sm" lineClamp={1} className="text-gray-800 dark:text-gray-200">
          {author}
        </Text>

        <Text size="xs" lineClamp={2} className="text-gray-500 dark:text-gray-400">
          Thể loại: {topicNames || "Đang cập nhật"}
        </Text>

        <Text size="xs" lineClamp={2} className="text-gray-500 dark:text-gray-400">
          {story.description || "Chưa có mô tả"}
        </Text>
      </div>
    </div>
  );
};

export default UserStoryCard;