import { Card, Avatar, Text, Group, Button, Stack } from '@mantine/core';
import {  UserPlus } from 'lucide-react';

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
      <Stack align="center" gap="md">
        <Avatar
          src={avatarUrl}
          size={100}
          radius="xl"
          className="border-4 border-white shadow-md"
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
          leftSection={<UserPlus size={18} />}
          variant="light"
          color="cyan"
          size="md"
          radius="full"
          fullWidth
          className="mt-2"
        >
          Theo dõi
        </Button>

        <Group grow gap="lg" justify="center" mt="lg" className="w-full">
          <Stack align="center" gap={4} className="min-w-0">
            <Text fw={700} size="lg">
              {stats.works}
            </Text>
            <Text size="xs" c="dimmed" className="whitespace-nowrap">
              Tác phẩm
            </Text>
          </Stack>

          <Stack align="center" gap={4} className="min-w-0">
            <Text fw={700} size="lg">
              {stats.readingLists}
            </Text>
            <Text size="xs" c="dimmed" className="whitespace-nowrap">
              Đang theo dõi
            </Text>
          </Stack>

          <Stack align="center" gap={4} className="min-w-0">
            <Text fw={700} size="lg">
              {stats.followers}
            </Text>
            <Text size="xs" c="dimmed" className="whitespace-nowrap">
              Người theo dõi
            </Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}