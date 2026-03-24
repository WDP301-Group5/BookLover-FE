import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Loader,
  Center,
  ActionIcon,
  Flex,
  Paper,
  Divider,
  Modal,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { showSuccess, showError } from "../../utils/notifications";
import { useState } from "react";
import {
  useReadingListById,
  useDeleteReadingList,
} from "../../hooks/useReadingList";

export function ReadingListDetailPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const { data: readingList, isLoading } = useReadingListById(listId || "");

  // Mutations
  const deleteListMutation = useDeleteReadingList();

  // UI state
  const [deleteListOpened, { open: openDeleteList, close: closeDeleteList }] =
    useDisclosure(false);

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Loader />
        </Center>
      </Container>
    );
  }

  if (!readingList) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text>Danh sách đọc không được tìm thấy</Text>
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  const stories = readingList.stories || [];
  const totalPages = Math.ceil(stories.length / LIMIT);
  const startIndex = (page - 1) * LIMIT;
  const paginatedStories = stories.slice(startIndex, startIndex + LIMIT);

  // Handlers
  const handleDeleteList = async () => {
    try {
      await deleteListMutation.mutateAsync(listId!);
      closeDeleteList();
      showSuccess("Danh sách đã được xóa", "Thành công");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      showError("Không thể xóa danh sách");
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Back Button */}
        <Group>
          <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
            <ArrowLeft size={20} />
          </ActionIcon>
          <Text fw={500} c="blue">
            Danh sách đọc
          </Text>
        </Group>

        {/* Reading List Header */}
        <Flex gap="lg" align="flex-start">
          {/* List Info */}
          <Stack gap="sm" style={{ flex: 1 }}>
            <div>
              <Title order={2}>{readingList.name}</Title>
            </div>

            <Group gap="xs">
              <Badge size="lg" variant="light">
                {stories.length} truyện
              </Badge>
            </Group>

            <Group gap="xs">
              <Button
                variant="light"
                leftSection={<Edit size={16} />}
                size="sm"
                onClick={() =>
                  navigate(
                    `/reading-list/${readingList._id || readingList.id}/manage`,
                  )
                }
              >
                Quản lý
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<Trash2 size={16} />}
                size="sm"
                onClick={openDeleteList}
                loading={deleteListMutation.isPending}
              >
                Xóa danh sách
              </Button>
            </Group>
          </Stack>
        </Flex>

        {/* Stories List */}
        {stories.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Text c="dimmed" size="lg">
                Danh sách này chưa có truyện nào
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="xs">
            <Title order={3}>Truyện trong danh sách</Title>
            {paginatedStories.map((story: any, idx: number) => (
              <div key={story._id || story.id}>
                <Paper
                  p="md"
                  radius="md"
                  className="hover:shadow-sm transition-shadow cursor-pointer border"
                  onClick={() => {
                    navigate(`/story/${story.slug}`);
                  }}
                >
                  <Group gap="md" align="flex-start">
                    {story.image && (
                      <img
                        src={story.image}
                        alt={story.title}
                        style={{
                          width: "80px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Stack gap="sm" style={{ flex: 1 }}>
                      <Group justify="space-between" align="flex-start">
                        <div style={{ flex: 1 }}>
                          <Text fw={600} size="md" lineClamp={2}>
                            {story.title}
                          </Text>
                          <Text size="sm" c="dimmed" lineClamp={1} mt={4}>
                            {story.authorId?.username || "Tác giả"}
                          </Text>
                        </div>
                      </Group>

                      {story.description && (
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {story.description}
                        </Text>
                      )}

                      <Group gap="sm" justify="space-between">
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">
                            {story.views || 0} lượt xem
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {story.isFinish ? "Hoàn thành" : "Đang cập nhật"}
                        </Text>
                      </Group>
                    </Stack>
                  </Group>
                </Paper>
                {idx < stories.length - 1 && <Divider />}
              </div>
            ))}
          </Stack>
        )}

        {stories.length > 0 && (
          <Center mt="lg">
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages > 0 ? totalPages : 1}
            />
          </Center>
        )}
      </Stack>

      {/* Delete List Confirmation Modal */}
      <Modal
        opened={deleteListOpened}
        onClose={closeDeleteList}
        title="Xác nhận xóa danh sách"
        centered
      >
        <Stack gap="md">
          <Group gap="sm" align="flex-start">
            <Text>
              Bạn có chắc muốn xóa danh sách "
              <strong>{readingList.name}</strong>" không? Hành động này không
              thể hoàn tác.
            </Text>
          </Group>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={closeDeleteList}
              disabled={deleteListMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              color="red"
              onClick={handleDeleteList}
              loading={deleteListMutation.isPending}
            >
              Xóa danh sách
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default ReadingListDetailPage;
