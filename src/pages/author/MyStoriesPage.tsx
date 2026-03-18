import {
  Box,
  Button,
  Container,
  Loader,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BookPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MyStoryCard from "../../components/story/MyStoryCard";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import {
  useDeleteStory,
  useMyStories,
  useUpdateStory,
} from "../../hooks/useStory";
import { showSuccess, showError } from "../../utils/notifications";
import { useUserStore } from "../../stores/useUserStore";

export default function MyStoriesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "published";
  const { data: stories, isLoading } = useMyStories();
  const deleteStory = useDeleteStory();
  const updateStory = useUpdateStory();
  const { user, updateUser } = useUserStore();

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);
  const [
    unpublishModalOpened,
    { open: openUnpublishModal, close: closeUnpublishModal },
  ] = useDisclosure(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Sync role: if user has stories but role is still "user", upgrade to "author"
  useEffect(() => {
    if (stories && stories.length > 0 && user?.role === "user") {
      updateUser({ role: "author" });
    }
  }, [stories, user?.role, updateUser]);

  // Filter stories theo tab
  const publishedStories = useMemo(
    () => stories?.filter((s) => s.status === "active") ?? [],
    [stories],
  );

  const allStories = useMemo(() => stories ?? [], [stories]);

  const handleDeleteClick = (id: string) => {
    setSelectedStoryId(id);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (!selectedStoryId) return;
    deleteStory.mutate(selectedStoryId, {
      onSettled: () => {
        closeDeleteModal();
        setSelectedStoryId(null);
      },
    });
  };

  const handleSubmitReviewClick = (id: string) => {
    setSelectedStoryId(id);
    openReviewModal();
  };

  const handleConfirmReview = () => {
    if (!selectedStoryId) return;
    updateStory.mutate(
      { id: selectedStoryId, data: { status: "pending" } },
      {
        onSuccess: () => {
          showSuccess("Truyện đã được gửi duyệt thành công");
          closeReviewModal();
          setSelectedStoryId(null);
        },
        onSettled: () => {
          closeReviewModal();
          setSelectedStoryId(null);
        },
      },
    );
  };

  const handleUnpublishClick = (id: string) => {
    setSelectedStoryId(id);
    openUnpublishModal();
  };

  const handleConfirmUnpublish = () => {
    if (!selectedStoryId) return;
    updateStory.mutate(
      { id: selectedStoryId, data: { status: "private" } },
      {
        onSuccess: () => {
          showSuccess("Truyện đã được hủy xuất bản");
          closeUnpublishModal();
          setSelectedStoryId(null);
        },
        onError: () => {
          showError("Lỗi khi hủy xuất bản truyện");
        },
        onSettled: () => {
          closeUnpublishModal();
          setSelectedStoryId(null);
        },
      },
    );
  };

  const renderStoryList = (list: typeof allStories) => {
    if (isLoading) {
      return (
        <Flex justify="center" py="xl">
          <Loader size="lg" />
        </Flex>
      );
    }

    if (list.length === 0) {
      return (
        <Stack align="center" py="xl" gap="md">
          <Text size="lg" c="dimmed">
            Bạn chưa có truyện nào
          </Text>
          <Button
            variant="light"
            leftSection={<BookPlus size={16} />}
            onClick={() => navigate("/author/write-story")}
          >
            Tạo truyện mới
          </Button>
        </Stack>
      );
    }

    return (
      <Stack gap={0}>
        {list.map((story) => (
          <MyStoryCard
            key={story._id}
            story={story}
            onDelete={handleDeleteClick}
            onSubmitReview={handleSubmitReviewClick}
            onUnpublish={handleUnpublishClick}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2}>Truyện của tôi</Title>
        <Button
          color="blue"
          leftSection={<BookPlus size={16} />}
          onClick={() => navigate("/author/write-story")}
        >
          Truyện mới
        </Button>
      </Flex>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(value) =>
          setSearchParams({ tab: value ?? "published" }, { replace: true })
        }
      >
        <Tabs.List mb="md">
          <Tabs.Tab value="published" fw={600}>
            Đã duyệt
          </Tabs.Tab>
          <Tabs.Tab value="all" fw={600}>
            Tất cả truyện
          </Tabs.Tab>
        </Tabs.List>

        <Box className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <Tabs.Panel value="published">
            {renderStoryList(publishedStories)}
          </Tabs.Panel>
          <Tabs.Panel value="all">{renderStoryList(allStories)}</Tabs.Panel>
        </Box>
      </Tabs>

      {/* Modal xác nhận xóa */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Xác nhận xóa truyện"
        centered
      >
        <Text size="sm" mb="lg">
          Bạn có chắc chắn muốn xóa truyện này không? Hành động này không thể
          hoàn tác.
        </Text>
        <Flex justify="flex-end" gap="sm">
          <Button variant="default" onClick={closeDeleteModal}>
            Hủy
          </Button>
          <Button
            color="red"
            loading={deleteStory.isPending}
            onClick={handleConfirmDelete}
          >
            Xóa
          </Button>
        </Flex>
      </Modal>

      {/* Modal xác nhận gửi duyệt */}
      <Modal
        opened={reviewModalOpened}
        onClose={closeReviewModal}
        title="Gửi duyệt truyện"
        centered
      >
        <Text size="sm" mb="lg">
          Bạn có chắc chắn muốn gửi truyện này để Admin duyệt? Truyện sẽ chuyển
          sang trạng thái "Chờ duyệt".
        </Text>
        <Flex justify="flex-end" gap="sm">
          <Button variant="default" onClick={closeReviewModal}>
            Hủy
          </Button>
          <Button
            color="blue"
            loading={updateStory.isPending}
            onClick={handleConfirmReview}
          >
            Gửi duyệt
          </Button>
        </Flex>
      </Modal>

      {/* Modal xác nhận hủy xuất bản */}
      <ConfirmDeleteModal
        opened={unpublishModalOpened}
        onClose={closeUnpublishModal}
        onConfirm={handleConfirmUnpublish}
        loading={updateStory.isPending}
        title="Hủy xuất bản truyện"
        message='Bạn có chắc muốn hủy xuất bản truyện này? Truyện sẽ chuyển sang trạng thái "Riêng tư" và không thể xuất bản lại.'
        confirmText="Hủy xuất bản"
        cancelText="Hủy"
      />
    </Container>
  );
}
