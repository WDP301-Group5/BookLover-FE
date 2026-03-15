import { Avatar, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { Book, Check, UserCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";
import { showError } from "../../utils/notifications";
import { FollowListModal } from "../user/user-row/FollowListModal";

interface AuthorHeaderProps {
  authorId: string;
  authorData?: AuthorPublicProfile | null;
  setAuthorData?: (data: AuthorPublicProfile) => void;
  refreshKey?: number;
  onRelationsChanged?: () => void;
}

export function AuthorHeader({
  authorId,
  authorData,
  setAuthorData,
  refreshKey = 0,
  onRelationsChanged,
}: AuthorHeaderProps) {
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [localAuthor, setLocalAuthor] = useState<AuthorPublicProfile | null>(
    authorData || null,
  );
  const [followersOpened, setFollowersOpened] = useState(false);
  const [followingOpened, setFollowingOpened] = useState(false);

  const currentUserId = useMemo(() => {
    try {
      const store = localStorage.getItem("user-store");
      if (!store) return null;
      return JSON.parse(store).state.user.id ?? null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!authorId) return;

    async function fetchAuthor() {
      try {
        const res = await UserService.getPublicProfile(authorId);

        const profile: AuthorPublicProfile = {
          ...res.profile,
          stories: res.stories ?? [],
          relationship: res.relationship,
          isSelf: res.relationship?.isSelf ?? false,
        };

        setLocalAuthor(profile);
        setAuthorData?.(profile);
      } catch (err) {
        console.error("Error fetching author:", err);
      }
    }

    fetchAuthor();
  }, [authorId, setAuthorData, refreshKey]);

  if (!localAuthor) return null;

  const isFollowing = !!localAuthor.relationship?.amIFollowing;

  const handleFollow = async () => {
    if (!authorId || !localAuthor) return;

    if (currentUserId === authorId) {
      showError("Không thể theo dõi bản thân");
      return;
    }

    setLoadingFollow(true);
    try {
      const wasFollowing = !!localAuthor.relationship?.amIFollowing;
      const res = await UserService.toggleFollow(authorId);

      const updatedAuthor: AuthorPublicProfile = {
        ...localAuthor,
        relationship: {
          ...localAuthor.relationship,
          ...res.relationship,
        },
        followersCount: Math.max(
          0,
          (localAuthor.followersCount || 0) +
            (res.relationship.amIFollowing ? (wasFollowing ? 0 : 1) : -1),
        ),
      };

      setLocalAuthor(updatedAuthor);
      setAuthorData?.(updatedAuthor);

      onRelationsChanged?.();
    } catch (err) {
      console.error(err);
      showError("Theo dõi thất bại");
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <>
      <div
        className="relative py-12"
        style={{
          backgroundImage: `url(${localAuthor.backgroundURL || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative max-w-6xl mx-auto px-4">
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap="xl"
            align="center"
          >
            <Avatar
              src={localAuthor.avatarURL || ""}
              size={200}
              radius="full"
              style={{ borderRadius: "50%" }}
              className="border-4 border-white"
            />

            <Stack gap="md" align="start" className="text-white">
              <Text size="xl" fw={800}>
                {localAuthor.penName || localAuthor.fullName}
              </Text>

              <Text size="lg" c="rgba(255,255,255,0.9)">
                @{localAuthor.username || ""}
              </Text>

              <Group gap="xl" mt="lg">
                <Flex direction="column" align="center" gap="4">
                  <Text fw={700} size="lg">
                    {localAuthor.storiesCount || 0}
                  </Text>
                  <Group gap="xs">
                    <Book size={20} />
                    <Text>Tác phẩm</Text>
                  </Group>
                </Flex>

                <Flex
                  direction="column"
                  align="center"
                  gap="4"
                  style={{ cursor: "pointer" }}
                  onClick={() => setFollowingOpened(true)}
                >
                  <Text fw={700} size="lg">
                    {localAuthor.followingCount || 0}
                  </Text>
                  <Group gap="xs">
                    <UserCheck size={20} />
                    <Text>Đang theo dõi</Text>
                  </Group>
                </Flex>

                <Flex
                  direction="column"
                  align="center"
                  gap="4"
                  style={{ cursor: "pointer" }}
                  onClick={() => setFollowersOpened(true)}
                >
                  <Text fw={700} size="lg">
                    {localAuthor.followersCount || 0}
                  </Text>
                  <Group gap="xs">
                    <Users size={20} />
                    <Text>Người theo dõi</Text>
                  </Group>
                </Flex>
              </Group>

              {!localAuthor.isSelf && (
                <Button
                  size="sm"
                  variant="filled"
                  color={isFollowing ? "blue" : "gray"}
                  leftSection={
                    isFollowing ? <Check size={16} /> : <Users size={16} />
                  }
                  loading={loadingFollow}
                  onClick={handleFollow}
                  className={`rounded-md px-4 py-1 ${
                    isFollowing
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white/90 text-blue-600 hover:bg-white"
                  }`}
                >
                  {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </Button>
              )}
            </Stack>
          </Flex>
        </div>
      </div>

      <FollowListModal
        opened={followersOpened}
        onClose={() => setFollowersOpened(false)}
        type="followers"
        userId={authorId}
        title="Người theo dõi"
        onRelationsChanged={onRelationsChanged}
      />

      <FollowListModal
        opened={followingOpened}
        onClose={() => setFollowingOpened(false)}
        type="following"
        userId={authorId}
        title="Đang theo dõi"
        onRelationsChanged={onRelationsChanged}
      />
    </>
  );
}