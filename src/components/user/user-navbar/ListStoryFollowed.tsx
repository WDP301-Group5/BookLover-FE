import React, { useEffect, useState } from "react";
import FollowStoryService from "../../../services/FollowStoryService";
import type { Story } from "../../../interfaces/Story";
import UserStoryCard from "../../common/UserStoryCard";

const ListStoryFollowed = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowedStories = async () => {
      try {
        setLoading(true);
        const res = await FollowStoryService.getMyFollowedStories();
        setStories(res || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách truyện theo dõi:", error);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedStories();
  }, []);

  return (
    <div className="flex flex-col gap-3 text-[#228be6] mb-3">
      <h1 className="text-[22px] font-semibold mb-2">Truyện đang theo dõi</h1>

      {loading ? (
        <div>Đang tải...</div>
      ) : stories.length === 0 ? (
        <div className="text-gray-500">Bạn chưa theo dõi truyện nào</div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {stories.map((story: unknown) => (
            <UserStoryCard
              key={story._id || story.id || story.slug}
              story={{
                ...story,
                id: story._id || story.id,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListStoryFollowed;