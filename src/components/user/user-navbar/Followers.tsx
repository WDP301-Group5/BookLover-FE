import { SimpleGrid, Text, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthorPublicProfile } from "../../../services/UserService";
import UserService from "../../../services/UserService";
import { UserFollowCard } from "../UserFollowCard";

interface FollowersProps {
  authorId?: string;
}

export default function Followers({ authorId }: FollowersProps) {
  const [followers, setFollowers] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getCurrentUserId = (): string | null => {
    try {
      const store = localStorage.getItem("user-store");
      if (!store) return null;
      return JSON.parse(store).state.user.id ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const userId = authorId ?? getCurrentUserId();
        if (!userId) throw new Error("Không tìm thấy userId");

        const data = await UserService.getFollowers(userId);
        setFollowers(data.map((f) => ({ ...f, isFollowing: f.isFollowing ?? false })));
      } catch (err: unknown) {
        setError(err.message || "Có lỗi xảy ra khi lấy danh sách followers");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [authorId]);

  const handleFollowToggle = async (authorId: string) => {
    try {
      const res = await UserService.toggleFollow(authorId);
      setFollowers((prev) =>
        prev.map((f) =>
          f._id === authorId
            ? { ...f, isFollowing: res.status === "follow", followersCount: res.followersCount }
            : f
        )
      );
    } catch (err: unknown) {
      console.error("Lỗi follow/unfollow:", err);
    }
  };

  const handleGoProfile = (authorId: string) => navigate(`/author-profile/${authorId}`);

  if (loading) return <Loader size="lg" />;
  if (error) return <Text color="red">{error}</Text>;
  if (!followers.length) return <Text>Chưa có người theo dõi nào.</Text>;

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {followers.map((f) => (
        <UserFollowCard
          key={f._id}
          displayName={f.fullName}
          username={f.username}
          avatarUrl={f.avatarURL || ""}
          backgroundUrl={f.backgroundURL || ""}
          stats={{
            works: f.storiesCount,
            readingLists: 0,
            followers: f.followersCount,
          }}
          showFollowButton
          isFollowing={f.isFollowing}
          onFollowToggle={() => handleFollowToggle(f._id)}
          onClickProfile={() => handleGoProfile(f._id)}
        />
      ))}
    </SimpleGrid>
  );
}