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
  Modal,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowLeft, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { showSuccess, showError } from "../../utils/notifications";
import {
  useReadingListById,
  useUpdateReadingList,
  useDeleteReadingList,
  useRemoveStoryFromList,
  useClearReadingList,
} from "../../hooks/useReadingList";
import { ReadingListEntryTable } from "../../components/reading-list/ReadingListEntryTable";
import { EditListNameModal } from "../../components/reading-list/EditListNameModal";

export function ReadingListManagementPage() {
  const navigate = useNavigate();
  const { listId } = useParams<{ listId: string }>();
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const { data: readingList, isLoading } = useReadingListById(listId || "");

  // Hooks for mutations
  const updateListMutation = useUpdateReadingList();
  const deleteListMutation = useDeleteReadingList();
  const removeStoryMutation = useRemoveStoryFromList();
  const clearAllMutation = useClearReadingList();

  // UI state
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [deleteListOpened, { open: openDeleteList, close: closeDeleteList }] =
    useDisclosure(false);
  const [
    deleteStoryOpened,
    { open: openDeleteStory, close: closeDeleteStory },
  ] = useDisclosure(false);
  const [clearAllOpened, { open: openClearAll, close: closeClearAll }] =
    useDisclosure(false);
  const [selectedStoryToDelete, setSelectedStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

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
  const isProcessing =
    updateListMutation.isPending ||
    deleteListMutation.isPending ||
    removeStoryMutation.isPending ||
    clearAllMutation.isPending;

  // Handlers
  const handleUpdateName = async (newName: string) => {
    try {
      await updateListMutation.mutateAsync({
        listId: listId!,
        data: { name: newName },
      });
      showSuccess("Tên danh sách đã được cập nhật", "Thành công");
    } catch (error) {
      showError("Không thể cập nhật tên danh sách");
      throw error;
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await removeStoryMutation.mutateAsync({
        listId: listId!,
        storyId,
      });
      showSuccess("Truyện đã được xóa khỏi danh sách", "Thành công");
      closeDeleteStory();
      setSelectedStoryToDelete(null);
    } catch (error) {
      showError("Không thể xóa truyện");
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllMutation.mutateAsync(listId!);
      showSuccess("Tất cả truyện đã được xóa khỏi danh sách", "Thành công");
      closeClearAll();
    } catch (error) {
      showError("Không thể xóa tất cả truyện");
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteListMutation.mutateAsync(listId!);
      showSuccess("Danh sách đã được xóa", "Thành công");
      navigate("/");
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
            Quản lý danh sách đọc
          </Text>
        </Group>

        {/* Reading List Header */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Flex gap="lg" align="flex-start">
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
                    onClick={openEditModal}
                    disabled={isProcessing}
                  >
                    Đổi tên danh sách
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<Trash2 size={16} />}
                    size="sm"
                    onClick={openDeleteList}
                    disabled={isProcessing || stories.length === 0}
                  >
                    Xóa danh sách
                  </Button>
                </Group>
              </Stack>
            </Flex>
          </Stack>
        </Paper>

        {/* Stories Management Section */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Flex justify="space-between" align="center">
              <Title order={3}>Quản lý danh sách đọc</Title>
              {stories.length > 0 && (
                <Button
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={openClearAll}
                  disabled={isProcessing}
                >
                  Xóa tất cả
                </Button>
              )}
            </Flex>

            {/* Stories Table */}
            <ReadingListEntryTable
              stories={paginatedStories}
              onDeleteStory={(storyId: string) => {
                const story = stories.find(
                  (s: any) => (s._id || s.id) === storyId,
                );
                if (story) {
                  setSelectedStoryToDelete({
                    id: storyId,
                    title: story.title,
                  });
                  openDeleteStory();
                }
              }}
              isLoading={removeStoryMutation.isPending}
            />

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
        </Paper>
      </Stack>

      {/* Edit List Name Modal */}
      <EditListNameModal
        opened={editModalOpened}
        onClose={closeEditModal}
        currentName={readingList.name}
        onSubmit={handleUpdateName}
        isLoading={updateListMutation.isPending}
      />

      {/* Delete Story Confirmation Modal */}
      <Modal
        opened={deleteStoryOpened}
        onClose={closeDeleteStory}
        title="Xác nhận xóa truyện"
        centered
      >
        <Stack gap="md">
          <Group gap="sm" align="flex-start">
            <Text>
              Bạn có chắc muốn xóa "
              <strong>{selectedStoryToDelete?.title}</strong>" khỏi danh sách
              này không?
            </Text>
          </Group>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={closeDeleteStory}
              disabled={removeStoryMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (selectedStoryToDelete) {
                  handleDeleteStory(selectedStoryToDelete.id);
                }
              }}
              loading={removeStoryMutation.isPending}
            >
              Xóa
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        opened={clearAllOpened}
        onClose={closeClearAll}
        title="Xác nhận xóa tất cả"
        centered
      >
        <Stack gap="md">
          <Group gap="sm" align="flex-start">
            <Text>
              Bạn có chắc muốn xóa tất cả {stories.length} truyện khỏi danh sách
              không? Hành động này không thể hoàn tác.
            </Text>
          </Group>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={closeClearAll}
              disabled={clearAllMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              color="red"
              onClick={handleClearAll}
              loading={clearAllMutation.isPending}
            >
              Xóa tất cả
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete List Confirmation Modal */}
      <Modal
        opened={deleteListOpened}
        onClose={closeDeleteList}
        title="Xác nhận xóa danh sách"
        centered
      >
        <Stack gap="md">
          <Group gap="sm" align="flex-start">
            <AlertTriangle size={20} color="red" style={{ flexShrink: 0 }} />
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

export default ReadingListManagementPage;
