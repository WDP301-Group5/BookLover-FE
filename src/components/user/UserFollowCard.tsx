import { Avatar, Box, Button, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { Book, UserCheck, UserPlus, Users } from "lucide-react";

interface UserFollowCardProps {
  displayName: string;
  username?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  stats: {
    works: number;
    readingLists: number;
    followers: number | string;
  };
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
  onClickProfile?: () => void;
}

export function UserFollowCard({
  displayName,
  username,
  avatarUrl = "",
  backgroundUrl = "",
  stats,
  showFollowButton = true,
  isFollowing = false,
  onFollowToggle,
  onClickProfile,
}: UserFollowCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="xl"
      withBorder
      className="relative cursor-pointer bg-white transition-shadow duration-300 hover:shadow-md"
      style={{ overflow: "visible" }}
      onClick={onClickProfile}
    >
      {backgroundUrl ? (
        <Box
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: 200,
            height: 100,
            borderRadius: 20,
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        >
          <Box
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: 20,
            }}
          />
        </Box>
      ) : null}

      <Stack align="center" gap={0} style={{ marginTop: 20, position: "relative", zIndex: 1 }}>
        <Avatar
          src={avatarUrl}
          size={100}
          radius="xl"
          style={{
            border: "4px solid white",
            position: "relative",
            zIndex: 2,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClickProfile?.();
          }}
        />

        <div
          className="mt-2 text-center"
          onClick={(e) => {
            e.stopPropagation();
            onClickProfile?.();
          }}
        >
          <Text fw={800} size="xl" lineClamp={1}>
            {displayName}
          </Text>
          <Text c="dimmed" size="sm">
            @{username || "unknown"}
          </Text>
        </div>

        {showFollowButton && (
          <Button
            leftSection={
              isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />
            }
            variant={isFollowing ? "light" : "filled"}
            color="cyan"
            size="md"
            radius="xl"
            fullWidth
            className="mt-3"
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle?.();
            }}
          >
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
        )}

        <Group grow justify="center" mt="lg" className="w-full">
          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.works}
            </Text>
            <Tooltip label="Tác phẩm" withArrow>
              <Book size={16} className="cursor-pointer text-gray-500" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.readingLists}
            </Text>
            <Tooltip label="Đang theo dõi" withArrow>
              <UserCheck size={16} className="cursor-pointer text-gray-500" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.followers}
            </Text>
            <Tooltip label="Người theo dõi" withArrow>
              <Users size={16} className="cursor-pointer text-gray-500" />
            </Tooltip>
          </div>
        </Group>
      </Stack>
    </Card>
  );
}