import { useState } from "react";
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Paper,
  Badge,
  Container,
  Modal,
  TextInput,
  Loader,
  Center,
  ActionIcon,
  Menu,
  Flex,
  Divider,
  Pagination,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import {
  useMyReadingLists,
  useCreateReadingList,
  useUpdateReadingList,
  useDeleteReadingList,
} from "../../hooks/useReadingList";
import { showSuccess, showError } from "../../utils/notifications";
import { useNavigate, useParams } from "react-router-dom";

export function ReadingListTab() {
  const navigate = useNavigate();
  const { authorId } = useParams();
  const { isLoggedIn, user } = useUserStore();
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [selectedList, setSelectedList] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [deleteListOpened, { open: openDeleteList, close: closeDeleteList }] =
    useDisclosure(false);
  const [selectedDeleteListId, setSelectedDeleteListId] = useState<
    string | null
  >(null);

  const { data: readingLists = [], isLoading } = useMyReadingLists();
  const createMutation = useCreateReadingList();
  const updateMutation = useUpdateReadingList();
  const deleteMutation = useDeleteReadingList();

  const totalPages = Math.ceil(readingLists.length / LIMIT);
  const startIndex = (page - 1) * LIMIT;
  const paginatedLists = readingLists.slice(startIndex, startIndex + LIMIT);

  if (!isLoggedIn) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Text>Vui lòng đăng nhập để xem danh sách đọc</Text>
        </Center>
      </Container>
    );
  }

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedList(null);
    setFormData({ name: "" });
    openModal();
  };

  const handleOpenEditModal = (list: any) => {
    setIsEditMode(true);
    setSelectedList(list);
    setFormData({
      name: list.name,
    });
    openModal();
  };

  const handleSaveList = async () => {
    if (!formData.name.trim()) {
      showError("Tên danh sách không được để trống");
      return;
    }

    try {
      if (isEditMode && selectedList) {
        await updateMutation.mutateAsync({
          listId: selectedList._id || selectedList.id,
          data: formData,
        });
        showSuccess("Cập nhật danh sách đọc thành công");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess("Tạo danh sách đọc thành công");
      }
      closeModal();
      setFormData({ name: "" });
    } catch (error: any) {
      showError(error.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteList = async (listId: string) => {
    setSelectedDeleteListId(listId);
    openDeleteList();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteListId) return;

    try {
      await deleteMutation.mutateAsync(selectedDeleteListId);
      closeDeleteList();
      setSelectedDeleteListId(null);
      showSuccess("Xóa danh sách đọc thành công");
    } catch (error: any) {
      showError(error.message || "Có lỗi xảy ra");
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Center py="xl">
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* Header with Create Button */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Danh sách đọc</Title>
            <Text size="sm" c="dimmed" mt="xs">
              {readingLists.length} danh sách
            </Text>
          </div>
          { authorId === user?._id &&
          <Button
            leftSection={<Plus size={18} />}
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tạo danh sách
          </Button>}
        </Group>

        {/* Reading Lists - Wattpad Style */}
        {readingLists.length === 0 ? (
          <Paper withBorder radius="md" p="xl">
            <Center py="xl">
              {authorId === user?._id ? 
              (<Stack align="center" gap="md">
                <Text c="dimmed" size="lg">
                  Bạn chưa có danh sách đọc nào
                </Text>
                <Button
                  variant="light"
                  leftSection={<Plus size={16} />}
                  onClick={handleOpenCreateModal}
                >
                  Tạo danh sách đầu tiên
                </Button>
              </Stack>): (
                <Text c="dimmed" size="lg">
                  Tác giả này chưa có danh sách đọc nào
                </Text>
              )}
            </Center>
          </Paper>
        ) : (
          <Stack gap="sm">
            {paginatedLists.map((list: any, idx: number) => (
              <div key={list._id || list.id}>
                <Paper
                  withBorder
                  radius="md"
                  p="md"
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    navigate(`/reading-list/${list._id || list.id}`);
                  }}
                >
                  <Flex gap="md" align="flex-start">
                    {/* List Info */}
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Group
                        justify="space-between"
                        align="flex-start"
                        gap="sm"
                      >
                        <div style={{ flex: 1 }}>
                          <Text fw={600} size="md" lineClamp={1}>
                            {list.name}
                          </Text>
                        </div>
                        <Menu shadow="md" width={150} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon
                              variant="subtle"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <MoreVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<Edit size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(list);
                              }}
                            >
                              Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<Trash2 size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteList(list._id || list.id);
                              }}
                            >
                              Xóa
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      <Group gap={6}>
                        <Badge size="xs" variant="light">
                          {list.stories?.length || 0} truyện
                        </Badge>
                      </Group>
                    </Stack>
                  </Flex>
                </Paper>
                {idx < readingLists.length - 1 && <Divider />}
              </div>
            ))}
          </Stack>
        )}

        {readingLists.length > 0 && (
          <Center mt="lg">
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages > 0 ? totalPages : 1}
            />
          </Center>
        )}

        {/* Create/Edit Modal */}
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={
            isEditMode ? "Chỉnh sửa danh sách đọc" : "Tạo danh sách đọc mới"
          }
          centered
        >
          <Stack gap="md">
            <TextInput
              label="Tên danh sách"
              placeholder="Nhập tên danh sách"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeModal}>
                Hủy
              </Button>
              <Button
                onClick={handleSaveList}
                loading={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isEditMode ? "Cập nhật" : "Tạo"}
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
            <Text>
              Bạn có chắc chắn muốn xóa danh sách này không? Hành động này không
              thể hoàn tác.
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                onClick={closeDeleteList}
                disabled={deleteMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                color="red"
                onClick={handleConfirmDelete}
                loading={deleteMutation.isPending}
              >
                Xóa danh sách
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
