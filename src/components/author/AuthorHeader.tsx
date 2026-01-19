import { Avatar, Button, Group, Text, Stack, Flex } from '@mantine/core';
import { Book, Users } from 'lucide-react';
import { authorProfileMock } from './authorProfile';

export function AuthorHeader() {
  const { displayName, username, avatarUrl, stats } = authorProfileMock;

  return (
    <div className="bg-gray-500 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Flex direction={{ base: 'column', sm: 'row' }} gap="xl" align="center">
          <Avatar src={avatarUrl} size={140} radius="full" className="border-4 border-white" />

          <Stack gap="md" align={{ base: 'center', sm: 'start' }} className="text-white">
            <Text size="xl" fw={800}>{displayName}</Text>
            <Text size="lg" opacity={0.9}>@{username}</Text>

            <Group gap="xl" mt="lg">
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">{stats.works}</Text>
                <Group gap="xs"><Book size={20} /><Text>Tác phẩm</Text></Group>
              </Flex>
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">{stats.followers}</Text>
                <Group gap="xs"><Users size={20} /><Text>Đang Theo Dõi</Text></Group>
              </Flex>
              <Flex direction="column" align="center" gap="4">
                <Text fw={700} size="lg">{stats.followers}</Text>
                <Group gap="xs"><Users size={20} /><Text>Người Theo Dõi</Text></Group>
              </Flex>
            </Group>

            <Button size="md" leftSection={<Users size={18} />} className="bg-blue-600 hover:bg-blue-700 mt-4">
              Theo dõi
            </Button>
          </Stack>
        </Flex>
      </div>
    </div>
  );
}