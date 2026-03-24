import {
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconBook,
  IconBrain,
  IconCheck,
  IconDotsVertical,
  IconInfoCircle,
  IconLock,
  IconLockOff,
  IconX,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { AIAnalysisBadge } from "../../../components/admin/AIAnalysisBadge";
import { AIAnalysisDetailModal } from "../../../components/admin/AIAnalysisDetailModal";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import { DataTableFilter } from "../../../components/data-table/filter";
import {
  useAnalyzeStory,
  useApproveStory,
  useBanStory,
  useRejectStory,
  useUnbanStory,
} from "../../../hooks/useAdminCensor";
import type { Story } from "../../../interfaces/Story";
import { format } from "../../../lib/format";
import { AdminCensorService } from "../../../services/AdminCensorService";
import { StoryDetailModal } from "./AdminStoryModeration";

export function AdminPendingStories() {
  const { mutate: approveStory } = useApproveStory();
  const { mutate: rejectStory } = useRejectStory();
  const { mutate: banStory } = useBanStory();
  const { mutate: unbanStory } = useUnbanStory();
  const { mutate: analyzeStory, isPending: isAnalyzing } = useAnalyzeStory();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [
    storyDetailOpened,
    { open: openStoryDetail, close: closeStoryDetail },
  ] = useDisclosure(false);

  const handleViewDetail = (story: Story) => {
    setSelectedStory(story);
    openDetail();
  };

  const handleViewStoryDetail = (story: Story) => {
    setSelectedStory(story);
    openStoryDetail();
  };

  const handleAnalyze = (story: Story) => {
    analyzeStory(story._id);
  };

  const handleBan = (story: Story) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Khóa truyện",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Vui lòng nhập lý do khóa truyện{" "}
            <Text span fw={600}>
              "{story.title}"
            </Text>
          </Text>
          <Textarea
            placeholder="Nhập lý do vi phạm..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Khóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) {
          return;
        }
        banStory({ id: story._id, reason });
      },
    });
  };

  const handleUnban = (story: Story) => {
    modals.openConfirmModal({
      title: "Mở khóa truyện",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn mở khóa truyện{" "}
          <Text span fw={600}>
            "{story.title}"
          </Text>
          ? Truyện sẽ được hiển thị trở lại trên hệ thống.
        </Text>
      ),
      labels: { confirm: "Mở khóa", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        unbanStory(story._id);
      },
    });
  };

  const handleApprove = (story: Story) => {
    modals.openConfirmModal({
      title: "Xác nhận duyệt",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn duyệt truyện{" "}
          <Text span fw={600}>
            "{story.title}"
          </Text>
          ? Truyện sẽ được hiển thị công khai trên hệ thống.
        </Text>
      ),
      labels: { confirm: "Duyệt", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        approveStory(story._id);
      },
    });
  };

  const handleReject = (story: Story) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Từ chối duyệt truyện",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Vui lòng nhập lý do từ chối truyện{" "}
            <Text span fw={600}>
              "{story.title}"
            </Text>
          </Text>
          <Textarea
            placeholder="Nhập lý do vi phạm..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Từ chối", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) {
          return;
        }
        rejectStory({ id: story._id, reason });
      },
    });
  };

  const dataTable = useDataTable<Story>({
    columns: getColumns(
      handleApprove,
      handleReject,
      handleAnalyze,
      isAnalyzing,
      handleViewDetail,
      handleViewStoryDetail,
      handleBan,
      handleUnban,
    ),
    service: () => AdminCensorService.getPendingStories(true), // Enable AI analysis
    queryKey: ["pending-stories", "with-ai"],
  });

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Duyệt truyện mới</Title>
      </Group>

      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <AIAnalysisDetailModal
        story={selectedStory!}
        opened={detailOpened}
        onClose={closeDetail}
      />

      <StoryDetailModal
        story={selectedStory}
        opened={storyDetailOpened}
        onClose={closeStoryDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewAIDetail={handleViewDetail}
      />
    </div>
  );
}

function getColumns(
  onApprove: (story: Story) => void,
  onReject: (story: Story) => void,
  onAnalyze: (story: Story) => void,
  isAnalyzing: boolean,
  onViewDetail: (story: Story) => void,
  onViewStoryDetail: (story: Story) => void,
  onBan: (story: Story) => void,
  onUnban: (story: Story) => void,
): ColumnDef<Story>[] {
  return [
    {
      accessorKey: "image",
      header: "Ảnh bìa",
      cell: ({ row }) => (
        <Avatar
          src={row.original.image}
          alt={row.original.title}
          radius="sm"
          size="lg"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Tên truyện",
      cell: ({ row }) => <Text fw={500}>{row.original.title}</Text>,
    },
    {
      accessorKey: "authorId",
      header: "Tác giả",
      cell: ({ row }) => (
        <Group gap="xs" className="flex-nowrap whitespace-nowrap">
          <Text size="sm" fw={500}>
            {row.original.authorId.fullName}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: "aiAnalysis",
      header: "Phân tích",
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <AIAnalysisBadge story={row.original} />
        </Group>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: () => (
        <Badge color="yellow" variant="filled">
          Chờ duyệt
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: ({ row }) => format.date(new Date(row.original.createdAt)),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button
              variant="light"
              color="blue"
              size="xs"
              rightSection={<IconDotsVertical size={14} />}
            >
              Thao tác
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconBrain size={14} />}
              onClick={() => onAnalyze(row.original)}
              disabled={isAnalyzing}
            >
              {row.original.aiAnalysis ? "Phân tích lại" : "Phân tích"}
            </Menu.Item>
            {row.original.aiAnalysis && (
              <Menu.Item
                leftSection={<IconInfoCircle size={14} />}
                onClick={() => onViewDetail(row.original)}
              >
                Xem phân tích
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconBook size={14} />}
              onClick={() => onViewStoryDetail(row.original)}
            >
              Xem chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCheck size={14} />}
              onClick={() => onApprove(row.original)}
              color="green"
            >
              Duyệt
            </Menu.Item>
            <Menu.Item
              leftSection={<IconX size={14} />}
              onClick={() => onReject(row.original)}
              color="red"
            >
              Từ chối
            </Menu.Item>
            <Menu.Divider />
            {row.original.status === "banned" ? (
              <Menu.Item
                leftSection={<IconLockOff size={14} />}
                onClick={() => onUnban(row.original)}
                color="green"
              >
                Mở khóa
              </Menu.Item>
            ) : (
              <Menu.Item
                leftSection={<IconLock size={14} />}
                onClick={() => onBan(row.original)}
                color="orange"
              >
                Khóa
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
}
