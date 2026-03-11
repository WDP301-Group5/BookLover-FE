import { Avatar, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { Book, Check, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";

interface AuthorHeaderProps {
  authorId: string;
  authorData?: AuthorPublicProfile | null;
  setAuthorData?: (data: AuthorPublicProfile) => void;
}

export function AuthorHeader({ authorId, authorData, setAuthorData }: AuthorHeaderProps) {
  const [author, setAuthor] = useState<AuthorPublicProfile>({
    _id: "",
    username: "",
    fullName: "",
    avatarURL: "",
    backgroundURL: "",
    followersCount: 0,
    followingCount: 0,
    storiesCount: 0,
    isFollowing: false,
  });
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    if (!authorId) return;

    async function fetchAuthor() {
      try {
        const data = await UserService.getPublicProfile(authorId);
        setAuthor(data);
        setAuthorData?.(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchAuthor();
  }, [authorId, setAuthorData]);

  const handleFollow = async () => {
    if (!authorId || !authorData) return;
    setLoadingFollow(true);

    try {
      const data = await UserService.toggleFollow(authorId);

      // Cập nhật parent state
      setAuthorData({
        ...authorData,
        isFollowing: data.status === "follow",
        followersCount: data.followersCount,
        followingCount: data.followingCount,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!authorData) return null;

  return (
    <div
      className="relative py-12"
      style={{
        backgroundImage: `url(${author.backgroundURL || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-6xl mx-auto px-4">
        <Flex direction={{ base: "column", sm: "row" }} gap="xl" align="center">
          <Avatar
            src={author.avatarURL || ""}
            size={200}
            radius="full"
			style={{ borderRadius: "50%" }}
            className="border-4 border-white"
          />
          <Stack
            gap="md"
            align={{ base: "center", sm: "start" }}
            className="text-white"
          >
            <Text size="xl" fw={800}>
              {author.penName}
            </Text>
            <Text size="lg" opacity={0.9}>
              @{author.username}
            </Text>

            <Group gap="xl" mt="lg">
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">
                  {author.storiesCount}
                </Text>
                <Group gap="xs">
                  <Book size={20} />
                  <Text>Tác phẩm</Text>
                </Group>
              </Flex>
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">
                  {author.followingCount}
                </Text>
                <Group gap="xs">
                  <UserCheck size={20} />
                  <Text>Đang theo dõi</Text>
                </Group>
              </Flex>
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">
                  {author.followersCount}
                </Text>
                <Group gap="xs">
                  <Users size={20} />
                  <Text>Người theo dõi</Text>
                </Group>
              </Flex>
            </Group>

            <Button
              size="sm"
              variant="filled"
              color={author.isFollowing ? "blue" : "gray"}
              leftSection={
                author.isFollowing ? <Check size={16} /> : <Users size={16} />
              }
              loading={loadingFollow}
              onClick={handleFollow}
              className={`rounded-md px-4 py-1 ${
                author.isFollowing
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-white/90 text-blue-600 hover:bg-white"
              }`}
            >
              {author.isFollowing ? "Đang theo dõi" : "Theo dõi"}
            </Button>
          </Stack>
        </Flex>
      </div>
    </div>
  );
}
