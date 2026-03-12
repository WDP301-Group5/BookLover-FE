// src/components/ProfilesTab.tsx
import { useState, useEffect } from "react";
import { Group, Text, Button, Avatar, Stack, Card } from "@mantine/core";
import UserService, { type AuthorPublicProfile } from "../../services/UserService";

interface Props {
  searchTerm: string;
}

const ProfilesTab = ({ searchTerm }: Props) => {
  const [users, setUsers] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setUsers([]);
      return;
    }

    setLoading(true);
    UserService.searchUsers(searchTerm)
      .then((res: AuthorPublicProfile[]) => setUsers(res))
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleToggleFollow = async (user: AuthorPublicProfile) => {
    if (!user._id) return;

    try {
      const res = await UserService.toggleFollow(user._id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, relationship: res.relationship }
            : u
        )
      );
    } catch (error) {
      console.error("Error toggle follow:", error);
    }
  };

  if (loading) {
    return <Text ta="center">Đang tải...</Text>;
  }

  return (
    <Stack gap="lg">
      {users.length ? (
        users.map((user) => (
          <Card
            key={user._id}
            withBorder
            shadow="sm"
            radius="lg"
            p="15"
            bg="white"
            styles={{
              root: {
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                },
              },
            }}
          >
            <Group justify="apart" align="center" wrap="nowrap" gap="xl">
              <Group wrap="nowrap" gap="lg">
                <Avatar
                  src={user.avatarURL || "/default-avatar.png"}
                  alt={user.username}
                  size={80}
                  radius="100"
                />

                <Stack gap={5}>
                  <Text fw={700} size="lg" lh={1.1}>
                    {user.penName || user.username}
                  </Text>

                  <Text size="sm" c="dimmed" lh={1}>
                    @{user.username}
                  </Text>

                  <Text size="sm" c="dimmed" lh={1.4} mt={4}>
                    <Text span fw={700} c="dark">
                      {user.storiesCount}
                    </Text>{" "}
                    Truyện ·{" "}
                    <Text span fw={700} c="dark">
                      {user.followersCount.toLocaleString()}
                    </Text>{" "}
                    Người theo dõi
                  </Text>
                </Stack>
              </Group>

              <Button
                variant={user.relationship?.amIFollowing ? "outline" : "filled"}
                color="blue"
                size="md"
                radius="xl"
                leftSection={
                  <Text fw={700}>
                    {user.relationship?.amIFollowing ? "✓" : "+"}
                  </Text>
                }
                ml="auto"
                onClick={() => handleToggleFollow(user)}
                styles={{
                  root: {
                    padding: "0 24px",
                    height: 35,
                    fontWeight: 600,
                    minWidth: 120,
                  },
                  label: {
                    color: user.relationship?.amIFollowing ? "blue" : "white",
                  },
                }}
              >
                {user.relationship?.amIFollowing ? "Đang theo dõi" : "Theo dõi"}
              </Button>
            </Group>
          </Card>
        ))
      ) : (
        <Text ta="center" c="dimmed" py="xl">
          Không tìm thấy người dùng nào
        </Text>
      )}
    </Stack>
  );
};

export default ProfilesTab;