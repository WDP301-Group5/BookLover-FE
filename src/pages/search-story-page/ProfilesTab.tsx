import { useState, useEffect } from "react";
import { Group, Text, Button, Avatar, Stack, Card } from "@mantine/core";
import UserService, {
  type AuthorPublicProfile,
} from "../../services/UserService";
import { showError, showSuccess } from "../../utils/notifications";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserPlus } from "lucide-react";

interface Props {
  searchTerm: string;
}

const ProfilesTab = ({ searchTerm }: Props) => {
  const [users, setUsers] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    UserService.searchUsers(searchTerm)
      .then((res: AuthorPublicProfile[]) => setUsers(res))
      .catch((error) => {
        console.error("Error searching users:", error);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [searchTerm]);

  const handleToggleFollow = async (user: AuthorPublicProfile) => {
    if (!user._id || user.relationship?.isSelf) return;

    try {
      const wasFollowing = !!user.relationship?.amIFollowing;
      const res = await UserService.toggleFollow(user._id);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
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

      if (res.status === "follow") {
        showSuccess(`Bạn đã theo dõi ${user.penName || user.username}`);
      } else {
        showSuccess(`Bạn đã bỏ theo dõi ${user.penName || user.username}`);
      }
    } catch (error) {
      console.error("Error toggle follow:", error);
      showError("Theo dõi thất bại");
    }
  };

  const handleGoProfile = (userId: string) => {
    navigate(`/author-profile/${userId}`);
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
            radius="lg"
            p="15"
            styles={{
              root: {
                transition: "all 0.2s ease",
                backgroundColor: "var(--mantine-color-body)",
                borderColor: "var(--mantine-color-default-border)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "var(--mantine-shadow-sm)",
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
                  style={{ cursor: "pointer" }}
                  onClick={() => user._id && handleGoProfile(user._id)}
                />

                <Stack
                  gap={5}
                  style={{ cursor: "pointer" }}
                  onClick={() => user._id && handleGoProfile(user._id)}
                >
                  <Text fw={700} size="lg" lh={1.1}>
                    {user.penName || user.username}
                  </Text>

                  <Text size="sm" c="dimmed" lh={1}>
                    @{user.username}
                  </Text>

                  <Text size="sm" c="dimmed" lh={1.4} mt={4}>
                    <Text span fw={700} inherit c="inherit">
                      {user.storiesCount}
                    </Text>{" "}
                    Truyện ·{" "}
                    <Text span fw={700} inherit c="inherit">
                      {user.followersCount.toLocaleString()}
                    </Text>{" "}
                    Người theo dõi
                  </Text>
                </Stack>
              </Group>

              {!user.relationship?.isSelf && (
                <Button
                  leftSection={
                    user.relationship?.amIFollowing ? (
                      <UserCheck size={16} />
                    ) : (
                      <UserPlus size={16} />
                    )
                  }
                  variant={user.relationship?.amIFollowing ? "light" : "filled"}
                  color="blue"
                  size="md"
                  radius="xl"
                  ml="auto"
                  onClick={() => handleToggleFollow(user)}
                  styles={{
                    root: {
                      minWidth: 145,
                      height: 40,
                      fontWeight: 600,
                      paddingInline: 20,
                    },
                  }}
                >
                  {user.relationship?.amIFollowing
                    ? "Đang theo dõi"
                    : "Theo dõi"}
                </Button>
              )}
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