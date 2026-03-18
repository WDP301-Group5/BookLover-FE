import {
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Chapter } from "../../interfaces/Chapter";
import { useChaptersByStoryForAuthor } from "../../hooks/useChapter";
import { timeAgo } from "../../utils";
import { AuthorService } from "../../services/AuthorService";
import { showError } from "../../utils/notifications";
import { useUserStore } from "../../stores/useUserStore";

interface ChaptersListModalProps {
  opened: boolean;
  onClose: () => void;
  storyId: string;
  storySlug: string;
  storyTitle: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Bản nháp", color: "gray" },
  pending: { label: "Chờ duyệt", color: "yellow" },
  active: { label: "Đã duyệt", color: "green" },
  rejected: { label: "Bị từ chối", color: "red" },
  banned: { label: "Bị cấm", color: "red.9" },
};

export default function ChaptersListModal({
  opened,
  onClose,
  storyId,
  storySlug,
  storyTitle,
}: ChaptersListModalProps) {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const [isCreating, setIsCreating] = useState(false);
  const {
    data: chapters = [],
    isLoading,
    error,
  } = useChaptersByStoryForAuthor(storyId);

  // Ensure role is "author" before navigating to write-chapter
  const navigateToChapter = (chapterNumber: number) => {
    if (user?.role === "user") {
      updateUser({ role: "author" });
    }
    onClose();
    navigate(
      `/author/story/${storySlug}/write-chapter?chapter=${chapterNumber}`,
    );
  };

  const handleChapterClick = (chapterNumber: number) => {
    navigateToChapter(chapterNumber);
  };

  const handleCreateNewChapter = async () => {
    try {
      setIsCreating(true);
      const nextNumber =
        chapters.length > 0
          ? Math.max(...chapters.map((c) => c.chapterNumber)) + 1
          : 1;
      const newTitle = `Chương ${nextNumber}`;

      const formData = new FormData();
      formData.append("storyId", storyId);
      formData.append("chapterNumber", String(nextNumber));
      formData.append("title", newTitle);
      formData.append("chapterType", "free");

      const blob = new Blob(["<p></p>"], { type: "text/html" });
      formData.append("file", blob, `${newTitle}.html`);

      const newChapter = await AuthorService.createChapter(formData);
      navigateToChapter(newChapter.chapterNumber);
    } catch {
      showError("Không thể tạo chương mới. Vui lòng thử lại.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      radius="lg"
      withCloseButton
      title={
        <Title order={2} ta="center" w="100%" size="h4">
          {storyTitle}
        </Title>
      }
      styles={{
        header: {
          width: "100%",
        },
        title: {
          width: "100%",
        },
        body: {
          paddingTop: 8,
        },
      }}
    >
      {isLoading ? (
        <Flex justify="center" py="xl">
          <Loader size="lg" />
        </Flex>
      ) : error ? (
        <Text c="red">Không thể tải danh sách chương</Text>
      ) : chapters.length === 0 ? (
        <Stack align="center" py="xl" gap="md">
          <Text c="dimmed">Chưa có chương nào</Text>
          <Button
            color="orange"
            leftSection={isCreating ? <Loader size={14} /> : <Plus size={16} />}
            onClick={handleCreateNewChapter}
            disabled={isCreating}
            loading={isCreating}
          >
            {isCreating ? "Đang tạo chương..." : "Tạo chương đầu tiên"}
          </Button>
        </Stack>
      ) : (
        <Stack gap={0}>
          <ScrollArea.Autosize mah={520} offsetScrollbars>
            <Stack gap="sm" px="md">
              {chapters.map((chapter: Chapter) => {
                const cfg =
                  statusConfig[(chapter.status as string) || "draft"] ||
                  statusConfig.draft;
                return (
                  <Flex
                    key={chapter.id}
                    justify="space-between"
                    align="center"
                    p="sm"
                    className="border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleChapterClick(chapter.chapterNumber)}
                  >
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Group gap="sm">
                        <Text fw={500} size="sm">
                          Chương {chapter.chapterNumber}
                        </Text>
                        <Badge size="sm" variant="light" color={cfg.color}>
                          {cfg.label}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {chapter.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Cập nhật{" "}
                        {timeAgo(chapter.updatedAt || new Date().toISOString())}
                      </Text>
                    </Stack>
                  </Flex>
                );
              })}
            </Stack>
          </ScrollArea.Autosize>

          <Button
            color="blue"
            leftSection={isCreating ? <Loader size={14} /> : <Plus size={16} />}
            mt="md"
            onClick={handleCreateNewChapter}
            fullWidth
            disabled={isCreating}
            loading={isCreating}
          >
            {isCreating ? "Đang tạo chương..." : "Chương mới"}
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
