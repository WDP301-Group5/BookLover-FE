import { Paper, Text, Group } from '@mantine/core';
import { Pin } from 'lucide-react';

interface PinnedMessageProps {
  date: string;
  content: string;
}

export function PinnedMessage({ date, content }: PinnedMessageProps) {
  return (
    <Paper p="lg" withBorder radius="md" className="bg-amber-50">
      <Group gap="md">
        <Pin size={24} className="text-blue-700" />
        <div>
          <Text size="sm" c="dimmed">{date}</Text>
          <Text mt="xs">{content}</Text>
        </div>
      </Group>
    </Paper>
  );
}