import { SimpleGrid, Stack, Title, Text, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";
import { UserFollowCard } from "../user/UserFollowCard";

interface FollowingTabProps {
  authorId?: string;
  setAuthorData?: React.Dispatch<
    React.SetStateAction<AuthorPublicProfile | null>
  >;
}

// Hàm lấy current userId từ localStorage
function getCurrentUserId(): string | null {
  try {
    const store = localStorage.getItem("user-store");
    if (!store) return null;
    return JSON.parse(store).state.user.id ?? null;
  } catch {
    return null;
  }
}

export function FollowingTab({ authorId, setAuthorData }: FollowingTabProps) {
  const [following, setFollowing] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchFollowing = async () => {
      const userId = getCurrentUserId();
      if (!userId) return setError("Không tìm thấy user hiện tại");

      try {
        setLoading(true);
        const data = await UserService.getFollowers(userId);
        // tất cả là đang follow
        setFollowing(
          data.map((f) => ({ ...f, isFollowing: f.isFollowing ?? true })),
        );
      } catch (err: any) {
        setError(
          err.message || "Có lỗi xảy ra khi lấy danh sách đang theo dõi",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const handleFollowToggle = async (id: string) => {
    try {
      const res = await UserService.toggleFollow(id);

      setFollowing((prev) =>
        prev.map((f) =>
          f._id === id
            ? {
                ...f,
                isFollowing: res.status === "follow",
                followersCount: res.followersCount,
              }
            : f,
        ),
      );

      // Update parent authorData nếu id trùng authorId
      if (id === authorId) {
        setAuthorData?.((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isFollowing: res.status === "follow",
            followersCount: res.followersCount,
            followingCount: res.followingCount,
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoProfile = (authorId: string) =>
    navigate(`/author-profile/${authorId}`);

  if (loading) return <Loader size="lg" />;
  if (error) return <Text color="red">{error}</Text>;
  if (following.length === 0) return <Text>Chưa theo dõi ai.</Text>;

  return (
    <Stack gap="xl" className="max-w-6xl mx-auto px-4">
      <Title order={3}>Đang theo dõi</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {following.map((f) => (
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
    </Stack>
  );
}
