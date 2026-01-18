import { Avatar, Paper, Text, Group, Stack } from '@mantine/core';
import { MessageCircle, Reply } from 'lucide-react';

interface ConversationItemProps {
  username: string;
  userAvatar?: string;
  date: string;
  content: string;
  authorReply?: string;
  authorReplyDate?: string;
}

export function ConversationItem({
  username,
  userAvatar,
  date,
  content,
  authorReply,
  authorReplyDate,
}: ConversationItemProps) {
  return (
    <Stack gap="lg">
      <Group gap="md">
        <Avatar src={userAvatar} size="md" radius="xl" />
        <Paper p="md" withBorder radius="md" className="flex-1 bg-gray-50">
          <Group justify="space-between">
            <Text fw={600}>{username}</Text>
            <Text size="sm" c="dimmed">{date}</Text>
          </Group>
          <Text mt="xs">{content}</Text>
        </Paper>
      </Group>

      {authorReply && (
        <Group gap="md" pl={60}>
          <Reply size={20} className="text-blue-600 mt-2" />
          <Paper p="md" withBorder radius="md" className="flex-1 bg-blue-50">
            <Group gap="xs" align="center">
              <MessageCircle size={18} className="text-blue-600" />
              <Text fw={600} c="blue.8">Tác giả trả lời</Text>
              {authorReplyDate && <Text size="sm" c="dimmed">· {authorReplyDate}</Text>}
            </Group>
            <Text mt="xs">{authorReply}</Text>
          </Paper>
        </Group>
      )}
    </Stack>
  );
}