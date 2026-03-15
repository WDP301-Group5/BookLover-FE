import { useEffect, useState } from "react";
import { Text } from "@mantine/core";
import StoryItemCard from "../../story/StoryItemCard";
import UserService from "../../../services/UserService";
import { useUserStore } from "../../../stores/useUserStore";
import { showError } from "../../../utils/notifications";

const MyStory = () => {
  const { user } = useUserStore();
  const [stories, setStories] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyStories = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await UserService.getPublicProfile(user.id);
        setStories(data?.stories || []);
      } catch (error) {
        console.error("Failed to fetch my stories:", error);
        showError("Không tải được danh sách truyện của bạn");
      } finally {
        setLoading(false);
      }
    };

    fetchMyStories();
  }, [user?.id]);

  if (!user) {
    return <Text>Vui lòng đăng nhập.</Text>;
  }

  if (loading) {
    return <Text>Đang tải truyện của bạn...</Text>;
  }

  return (
    <div className="flex flex-col gap-3 text-[#228be6] mb-3">
      <h1 className="text-lg font-semibold mb-2 text-[22px]">Truyện của tôi</h1>

      {stories.length === 0 ? (
        <Text c="dimmed">Bạn chưa có truyện nào.</Text>
      ) : (
        stories.map((story) => (
          <StoryItemCard
            key={story._id}
            story={{
              ...story,
              id: story._id,
            }}
            type="top"
          />
        ))
      )}
    </div>
  );
};

export default MyStory;