import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { UserCheck, UserPlus } from "lucide-react";

interface FollowUserRowProps {
  displayName: string;
  username?: string;
  avatarUrl?: string;
  storiesCount?: number;
  followersCount?: number;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onClickProfile?: () => void;
}

export function FollowUserRow({
  displayName,
  username,
  avatarUrl,
  storiesCount = 0,
  followersCount = 0,
  isFollowing = false,
  onFollowToggle,
  onClickProfile,
}: FollowUserRowProps) {
  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group
        gap="md"
        wrap="nowrap"
        style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
        onClick={onClickProfile}
      >
        <Avatar src={avatarUrl || ""} size={44} radius="xl" />

        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text fw={600} size="md" truncate>
            {displayName}
            {username ? (
              <Text span c="dimmed" fw={400} ml={6}>
                @{username}
              </Text>
            ) : null}
          </Text>

          <Text size="sm" c="dimmed">
            {storiesCount} Tác phẩm • {followersCount} Người theo dõi
          </Text>
        </Stack>
      </Group>

      <Button
        leftSection={
          isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />
        }
        variant={isFollowing ? "light" : "filled"}
        color="cyan"
        radius="xl"
        size="md"
        onClick={(e) => {
          e.stopPropagation();
          onFollowToggle?.();
        }}
        styles={{
          root: {
            minWidth: 145,
            height: 40,
            fontWeight: 600,
            paddingInline: 20,
          },
        }}
      >
        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
      </Button>
    </Group>
  );
}