import { Avatar, Box, Button, Card, Group, Stack, Text, Tooltip } from "@mantine/core";
import { Book, UserCheck, UserPlus, Users } from "lucide-react";

interface UserFollowCardProps {
  displayName: string;
  username: string;
  avatarUrl: string;
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
  avatarUrl,
  backgroundUrl,
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
      className="relative hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer"
      sx={{ overflow: "visible" }}
    >
      {/* Background */}
      {backgroundUrl && (
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 140,
            height: 40,
            borderRadius: 20,
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 20,
            },
          }}
        />
      )}

      <Stack align="center" gap={0} sx={{ mt: 20, position: "relative", zIndex: 1 }}>
        {/* Avatar */}
        <Avatar
          src={avatarUrl}
          size={100}
          radius="xl"
          sx={{ border: "4px solid white", position: "relative", zIndex: 2 }}
          onClick={onClickProfile}
        />

        <div className="text-center mt-2" onClick={onClickProfile}>
          <Text fw={800} size="xl" lineClamp={1}>
            {displayName}
          </Text>
          <Text c="dimmed" size="sm">
            @{username}
          </Text>
        </div>

        {showFollowButton && (
          <Button
            leftSection={<UserPlus size={16} />}
            variant={isFollowing ? "light" : "filled"}
            color="cyan"
            size="md"
            radius="full"
			fontSize="sm"
            fullWidth
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation(); // tránh click card
              onFollowToggle?.();
            }}
          >
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </Button>
        )}

        {/* Stats */}
        <Group grow justify="center" mt="lg" className="w-full">
          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.works}
            </Text>
            <Tooltip label="Tác phẩm" withArrow>
              <Book size={16} className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.readingLists}
            </Text>
            <Tooltip label="Đang theo dõi" withArrow>
              <UserCheck size={16} className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.followers}
            </Text>
            <Tooltip label="Người theo dõi" withArrow>
              <Users size={16} className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>
        </Group>
      </Stack>
    </Card>
  );
}