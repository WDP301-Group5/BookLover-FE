import { Card, Avatar, Text, Group, Button, Stack, Tooltip } from "@mantine/core";
import { BookOpen, Bookmark, Users, UserPlus } from "lucide-react";

interface UserFollowCardProps {
  displayName: string;
  username: string;
  avatarUrl: string;
  stats: {
    works: number;
    readingLists: number;
    followers: number | string;
  };
}

export function UserFollowCard({
  displayName,
  username,
  avatarUrl,
  stats,
}: UserFollowCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="xl"
      withBorder
      className="hover:shadow-md transition-shadow duration-300 bg-white"
    >
      <Stack align="center" gap={0}>
        <Avatar
          src={avatarUrl}
          size={100}
          radius="xl"
          className="border-4 border-white"
        />

        <div className="text-center">
          <Text fw={800} size="xl" lineClamp={1}>
            {displayName}
          </Text>
          <Text c="dimmed" size="sm">
            @{username}
          </Text>
        </div>

        <Button
          leftSection={<UserPlus size={16} />}
          variant="light"
          color="cyan"
          size="md"
          radius="full"
          fullWidth
          className="mt-2"
        >
          Theo dõi
        </Button>

        {/* Stats with tooltip */}
        <Group grow justify="center" mt="lg" className="w-full">

          {/* Works */}
          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.works}
            </Text>

            <Tooltip label="Tác phẩm" withArrow>
              <BookOpen size={16} className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>

          {/* Reading lists */}
          <div className="flex flex-col items-center">
            <Text fw={700} size="lg" className="leading-none">
              {stats.readingLists}
            </Text>

            <Tooltip label="Danh sách đọc" withArrow>
              <Bookmark size={16} className="text-gray-500 cursor-pointer" />
            </Tooltip>
          </div>

          {/* Followers */}
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
