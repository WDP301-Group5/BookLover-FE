import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  Image,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Eye,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Story } from "../../interfaces/Story";
import { ShorterNumber, timeAgo } from "../../utils";
import ChaptersListModal from "../author/ChaptersListModal";

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Bản nháp", color: "gray" },
  pending: { label: "Chờ duyệt", color: "yellow" },
  active: { label: "Đã duyệt", color: "green" },
  rejected: { label: "Bị từ chối", color: "red" },
  private: { label: "Riêng tư", color: "blue" },
  banned: { label: "Bị cấm", color: "red.9" },
};

interface MyStoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
  onSubmitReview: (id: string) => void;
  onUnpublish?: (id: string) => void;
}

export default function MyStoryCard({
  story,
  onDelete,
  onSubmitReview,
  onUnpublish,
}: MyStoryCardProps) {
  const navigate = useNavigate();
  const cfg = statusConfig[story.status] ?? statusConfig.draft;
  const [
    chaptersModalOpened,
    { open: openChaptersModal, close: closeChaptersModal },
  ] = useDisclosure(false);

  return (
    <Flex
      gap="md"
      align="flex-start"
      p="md"
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {/* Ảnh bìa */}
      <Image
        src={story.image}
        alt={story.title}
        w={80}
        h={107}
        radius="sm"
        fit="cover"
        className="flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/story/${story.slug}`)}
      />

      {/* Nội dung chính */}
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        <Flex gap="sm" align="center" wrap="wrap">
          <Text
            component={Link}
            to={`/story/${story.slug}`}
            fw={600}
            size="md"
            className="hover:text-blue-600 hover:underline"
            lineClamp={1}
          >
            {story.title}
          </Text>
          <Badge size="sm" variant="light" color={cfg.color}>
            {cfg.label}
          </Badge>
        </Flex>

        <Text size="sm" c="dimmed">
          Cập nhật {timeAgo(story.updatedAt)}
        </Text>

        {/* Thống kê */}
        <Group gap="lg" mt={2}>
          <Group gap={4}>
            <Eye size={14} className="text-gray-500" />
            <Text size="xs" c="dimmed">
              {ShorterNumber(story.views || 0)}
            </Text>
          </Group>
          <Group gap={4}>
            <Star size={14} className="text-gray-500" />
            <Text size="xs" c="dimmed">
              {ShorterNumber(story.stars || 0)}
            </Text>
          </Group>
          <Group gap={4}>
            <MessageCircle size={14} className="text-gray-500" />
            <Text size="xs" c="dimmed">
              {ShorterNumber(story.rates || 0)}
            </Text>
          </Group>
        </Group>
      </Stack>

      {/* Hành động */}
      <Flex gap="xs" align="center" className="flex-shrink-0">
        <Button size="sm" color="blue" onClick={openChaptersModal}>
          Tiếp tục viết
        </Button>

        <Menu shadow="md" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <MoreHorizontal size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<Pencil size={14} />}
              onClick={() => navigate(`/author/story/${story._id}/edit-info`)}
            >
              Sửa thông tin
            </Menu.Item>
            <Menu.Divider />

            {/* {story.status === "draft" && (
              <Menu.Item
                leftSection={<Send size={14} />}
                onClick={() => onSubmitReview(story._id)}
              >
                Gửi duyệt
              </Menu.Item>
            )} */}

            {story.status === "active" && (
              <>
                <Menu.Item
                  color="red"
                  leftSection={<X size={14} />}
                  onClick={() => onUnpublish?.(story._id)}
                >
                  Hủy xuất bản
                </Menu.Item>
                <Menu.Divider />
              </>
            )}

            <Menu.Item
              color="red"
              leftSection={<Trash2 size={14} />}
              onClick={() => onDelete(story._id)}
            >
              Xóa truyện
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <ChaptersListModal
        opened={chaptersModalOpened}
        onClose={closeChaptersModal}
        storyId={story._id}
        storySlug={story.slug}
        storyTitle={story.title}
      />
    </Flex>
  );
}
