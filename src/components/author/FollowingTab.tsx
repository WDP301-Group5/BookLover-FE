import { SimpleGrid, Stack, Title, Text, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";
import { UserFollowCard } from "../user/UserFollowCard";

interface FollowingTabProps {
  authorId?: string;
  layout?: "profile" | "compact";
  showTitle?: boolean;
  refreshKey?: number;
  onFollowChanged?: () => void;
}

export function FollowingTab({
  authorId,
  layout = "profile",
  showTitle = true,
  refreshKey = 0,
  onFollowChanged,
}: FollowingTabProps) {
  const [following, setFollowing] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const gridCols =
    layout === "profile"
      ? { base: 1, sm: 2, lg: 4 }
      : { base: 1, sm: 2, lg: 3 };

  const spacing = layout === "profile" ? "lg" : "md";
  const stackGap = layout === "profile" ? "xl" : "md";
  const wrapperClass = layout === "profile" ? "max-w-6xl mx-auto px-4" : "";

  useEffect(() => {
    if (!authorId) return;

    const fetchFollowing = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await UserService.getFollowing(authorId, 1);
        setFollowing(data.following);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy danh sách đang theo dõi");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [authorId, refreshKey]);

  const handleFollowToggle = async (id: string) => {
    try {
      const targetUser = following.find((u) => u._id === id);
      if (!targetUser || targetUser.relationship?.isSelf) return;

      const wasFollowing = !!targetUser.relationship?.amIFollowing;
      const res = await UserService.toggleFollow(id);

      setFollowing((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
                ...u,
                relationship: {
                  ...u.relationship,
                  ...res.relationship,
                },
                followersCount: Math.max(
                  0,
                  (u.followersCount || 0) +
                    (res.relationship.amIFollowing
                      ? wasFollowing
                        ? 0
                        : 1
                      : -1),
                ),
              }
            : u,
        ),
      );

      onFollowChanged?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoProfile = (userId: string) => {
    navigate(`/author-profile/${userId}`);
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <Text c="red">{error}</Text>;
  if (!following || following.length === 0) {
    return <Text>Chưa theo dõi ai.</Text>;
  }

  return (
    <Stack gap={stackGap} className={wrapperClass}>
      {showTitle && <Title order={3}>Đang theo dõi</Title>}

      <SimpleGrid cols={gridCols} spacing={spacing}>
        {following?.map((f) => (
          <UserFollowCard
            key={f._id}
            displayName={f.fullName}
            username={f.username || ""}
            avatarUrl={f.avatarURL || ""}
            backgroundUrl={f.backgroundURL || ""}
            stats={{
              storiesCount: f.storiesCount || 0,
              followingCount: f.followingCount || 0,
              followersCount: f.followersCount || 0,
            }}
            showFollowButton
            isFollowing={!!f.relationship?.amIFollowing}
            onFollowToggle={() => handleFollowToggle(f._id)}
            onClickProfile={() => handleGoProfile(f._id)}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
