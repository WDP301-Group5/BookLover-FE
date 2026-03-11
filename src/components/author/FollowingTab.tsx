import { SimpleGrid, Stack, Title, Text, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";
import { UserFollowCard } from "../user/UserFollowCard";

interface FollowingTabProps {
  authorId?: string;
  setAuthorData?: (data: AuthorPublicProfile) => void;
}

export function FollowingTab({ authorId }: FollowingTabProps) {
  const [following, setFollowing] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorId) return;

    const fetchFollowing = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await UserService.getFollowing(authorId, 1);
        setFollowing(data);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi lấy danh sách đang theo dõi");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [authorId]);

  const handleFollowToggle = async (id: string) => {
    try {
      const res = await UserService.toggleFollow(id);

      setFollowing((prev) =>
        prev.map((f) =>
          f._id === id
            ? {
                ...f,
                relationship: {
                  amIFollowing: res.relationship.amIFollowing,
                  followsMe: f.relationship?.followsMe ?? false,
                  isMutual:
                    res.relationship.amIFollowing &&
                    (f.relationship?.followsMe ?? false),
                },
              }
            : f
        )
      );
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
    <Stack gap="xl" className="max-w-6xl mx-auto px-4">
      <Title order={3}>Đang theo dõi</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        {following.map((f) => (
          <UserFollowCard
            key={f._id}
            displayName={f.fullName}
            username={f.username || ""}
            avatarUrl={f.avatarURL || ""}
            backgroundUrl={f.backgroundURL || ""}
            stats={{
              works: f.storiesCount || 0,
              readingLists: 0,
              followers: f.followersCount || 0,
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