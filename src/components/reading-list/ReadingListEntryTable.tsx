import {
  Table,
  ActionIcon,
  Stack,
  Text,
  Group,
  Badge,
  Paper,
} from "@mantine/core";
import { Trash2 } from "lucide-react";

interface Story {
  _id?: string;
  id?: string;
  title: string;
  authorId?: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
  };
  description?: string;
  status?: string;
  isFinish?: boolean;
  totalChapters?: number;
  chapters?: any[];
  createdAt?: Date | string;
}

interface Props {
  stories: Story[];
  onDeleteStory: (storyId: string) => void;
  isLoading: boolean;
  onShowConfirmation?: (storyTitle: string) => void;
}

export const ReadingListEntryTable = ({
  stories,
  onDeleteStory,
  isLoading,
  onShowConfirmation,
}: Props) => {
  if (stories.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder ta="center">
        <Text c="dimmed">Danh sách truyện trống</Text>
      </Paper>
    );
  }

  const rows = stories.map((story) => {
    const authorName =
      story.authorId?.name || story.authorId?.username || "Unknown Author";
    const displayId = story._id || story.id;

    return (
      <Table.Tr key={displayId}>
        <Table.Td>
          <Stack gap={0}>
            <Text fw={500} size="sm">
              {story.title}
            </Text>
            <Text size="xs" c="dimmed">
              {authorName}
            </Text>
          </Stack>
        </Table.Td>
        <Table.Td>
          {story.status ? (
            <Badge size="sm" variant="light">
              {story.isFinish ? "Hoàn thành" : "Đang cập nhật"}
            </Badge>
          ) : (
            <Text size="sm" c="dimmed">
              —
            </Text>
          )}
        </Table.Td>
        <Table.Td>
          <Group justify="inherit" gap={0}>
            <ActionIcon
              variant="subtle"
              color="red"
              loading={isLoading}
              onClick={() => {
                onShowConfirmation?.(story.title);
                onDeleteStory(displayId!);
              }}
            >
              <Trash2 size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Tên truyện</Table.Th>
          <Table.Th>Trạng thái</Table.Th>
          <Table.Th>Hành động</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
