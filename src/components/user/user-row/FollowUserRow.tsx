import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { Check, Users } from "lucide-react";

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
        variant={isFollowing ? "light" : "outline"}
        color={isFollowing ? "teal" : "gray"}
        radius="md"
        leftSection={isFollowing ? <Check size={16} /> : <Users size={16} />}
        onClick={(e) => {
          e.stopPropagation();
          onFollowToggle?.();
        }}
      >
        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
      </Button>
    </Group>
  );
}