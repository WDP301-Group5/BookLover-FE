import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconBook,
  IconCheck,
  IconClockHour4,
  IconHistory,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ModerationHistoryTable } from "../../../components/common/ModerationHistoryTable";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTableFilter,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import { useApproveStory, useRejectStory } from "../../../hooks/useAdminCensor";
import type { Story } from "../../../interfaces/Story";
import { format } from "../../../lib/format";
import { AdminCensorService } from "../../../services/AdminCensorService";

// ── Story Detail Modal ─────────────────────────────────────────────────────────
function StoryDetailModal({
  story,
  opened,
  onClose,
  onApprove,
  onReject,
}: {
  story: Story | null;
  opened: boolean;
  onClose: () => void;
  onApprove: (story: Story) => void;
  onReject: (story: Story) => void;
}) {
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin", "story-chapters", story?._id],
    queryFn: () => AdminCensorService.getStoryChapters(story!._id),
    enabled: !!story,
  });

  if (!story) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          {story.title}
        </Text>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Story Info */}
        <Group align="flex-start" gap="md">
          <Image
            src={story.image}
            alt={story.title}
            w={120}
            radius="md"
            fallbackSrc="https://placehold.co/120x160?text=Ảnh"
          />
          <Stack gap={6} style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Tác giả
            </Text>
            <Group gap="xs">
              <Avatar src={story.authorId.avatar} size="sm" radius="xl" />
              <div>
                <Text size="sm" fw={500}>
                  {story.authorId.fullName}
                </Text>
                <Text size="xs" c="dimmed">
                  @{story.authorId.username}
                </Text>
              </div>
            </Group>
            <Text size="sm" c="dimmed" mt={4}>
              Thể loại
            </Text>
            <Group gap={4}>
              {story.topics.map((t) => (
                <Badge key={t} size="xs" variant="light">
                  {t}
                </Badge>
              ))}
            </Group>
            <Text size="sm" c="dimmed" mt={4}>
              Ngày gửi
            </Text>
            <Text size="sm">{format.date(new Date(story.createdAt))}</Text>
          </Stack>
        </Group>

        <Box>
          <Text size="sm" fw={600} mb={4}>
            Mô tả
          </Text>
          <Text size="sm" c="dimmed">
            {story.description || "Không có mô tả."}
          </Text>
        </Box>

        <Divider
          label={
            <Group gap={4}>
              <IconBook size={14} />
              <Text size="xs">
                Danh sách chương ({isLoading ? "..." : (chapters?.length ?? 0)})
              </Text>
            </Group>
          }
        />

        {isLoading ? (
          <Text size="sm">Đang tải danh sách chương...</Text>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Chương</Table.Th>
                <Table.Th>Tiêu đề</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {chapters && chapters.length > 0 ? (
                chapters.map(
                  (ch: {
                    _id: string;
                    chapterNumber: number;
                    title: string;
                    status: string;
                    createdAt?: string;
                  }) => (
                    <Table.Tr key={ch._id}>
                      <Table.Td>#{ch.chapterNumber}</Table.Td>
                      <Table.Td>{ch.title}</Table.Td>
                      <Table.Td>
                        <Badge
                          size="xs"
                          color={
                            ch.status === "active"
                              ? "green"
                              : ch.status === "pending"
                                ? "yellow"
                                : ch.status === "rejected"
                                  ? "red"
                                  : "gray"
                          }
                          variant="light"
                        >
                          {ch.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {format.date(new Date(ch.createdAt as string))}
                      </Table.Td>
                    </Table.Tr>
                  ),
                )
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text size="sm" c="dimmed" ta="center">
                      Chưa có chương nào.
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}

        <Divider />

        {/* Actions */}
        {story.status === "pending" && (
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="red"
              leftSection={<IconX size={14} />}
              onClick={() => {
                onClose();
                onReject(story);
              }}
            >
              Từ chối
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={14} />}
              onClick={() => {
                onClose();
                onApprove(story);
              }}
            >
              Phê duyệt
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}

// ── Pending Tab ────────────────────────────────────────────────────────────────
function PendingStoriesTab() {
  const { mutate: approveStory } = useApproveStory();
  const { mutate: rejectStory } = useRejectStory();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);

  const handleApprove = (story: Story) => {
    modals.openConfirmModal({
      title: "Xác nhận duyệt truyện",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn phê duyệt truyện{" "}
          <Text span fw={600}>
            "{story.title}"
          </Text>
          ?
        </Text>
      ),
      labels: { confirm: "Duyệt", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => approveStory(story._id),
    });
  };

  const handleReject = (story: Story) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Từ chối duyệt truyện",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Nhập lý do từ chối{" "}
            <Text span fw={600}>
              "{story.title}"
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Nhập lý do..."
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
        if (!reason.trim()) return;
        rejectStory({ id: story._id, reason });
      },
    });
  };

  const handleViewDetail = (story: Story) => {
    setSelectedStory(story);
    openDetail();
  };

  const dataTable = useDataTable<Story>({
    columns: getPendingColumns(handleApprove, handleReject, handleViewDetail),
    service: AdminCensorService.getPendingStories,
    queryKey: ["admin", "stories", "pending"],
  });

  return (
    <>
      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <StoryDetailModal
        story={selectedStory}
        opened={detailOpened}
        onClose={closeDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

// ── History Tab ────────────────────────────────────────────────────────────────
function HistoryStoriesTab() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [historyOpened, { open: openHistory, close: closeHistory }] =
    useDisclosure(false);

  const dataTable = useDataTable<Story>({
    columns: getHistoryColumns((story) => {
      setSelectedStory(story);
      openHistory();
    }),
    service: AdminCensorService.getManagedStories,
    queryKey: ["admin", "stories", "managed"],
  });

  return (
    <>
      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <Modal
        opened={historyOpened}
        onClose={closeHistory}
        title={<Text fw={700}>Lịch sử kiểm duyệt: {selectedStory?.title}</Text>}
        size="lg"
      >
        {selectedStory && (
          <ModerationHistoryTable
            targetType="Story"
            targetId={selectedStory._id}
          />
        )}
      </Modal>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function AdminStoryModeration() {
  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Kiểm duyệt Truyện</Title>
      </Group>

      <Tabs defaultValue="pending">
        <Tabs.List>
          <Tabs.Tab value="pending" leftSection={<IconClockHour4 size={16} />}>
            Chờ phê duyệt
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            Lịch sử phê duyệt
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="md">
          <PendingStoriesTab />
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="md">
          <HistoryStoriesTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

// ── Column definitions ─────────────────────────────────────────────────────────
function getPendingColumns(
  onApprove: (s: Story) => void,
  onReject: (s: Story) => void,
  onDetail: (s: Story) => void,
): ColumnDef<Story>[] {
  return [
    {
      accessorKey: "image",
      header: "Ảnh",
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
        <Group gap="xs">
          <Avatar src={row.original.authorId.avatar} size="sm" radius="xl" />
          <div>
            <Text size="sm" fw={500}>
              {row.original.authorId.fullName}
            </Text>
            <Text size="xs" c="dimmed">
              @{row.original.authorId.username}
            </Text>
          </div>
        </Group>
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
        <Group gap="xs" justify="center">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconInfoCircle size={14} />}
            onClick={() => onDetail(row.original)}
          >
            Chi tiết
          </Button>
          <Button
            variant="light"
            color="green"
            size="xs"
            leftSection={<IconCheck size={14} />}
            onClick={() => onApprove(row.original)}
          >
            Duyệt
          </Button>
          <Button
            variant="light"
            color="red"
            size="xs"
            leftSection={<IconX size={14} />}
            onClick={() => onReject(row.original)}
          >
            Từ chối
          </Button>
        </Group>
      ),
    },
  ];
}

function getHistoryColumns(onHistory: (s: Story) => void): ColumnDef<Story>[] {
  return [
    {
      accessorKey: "image",
      header: "Ảnh",
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
        <Group gap="xs">
          <Avatar src={row.original.authorId.avatar} size="sm" radius="xl" />
          <Text size="sm">{row.original.authorId.fullName}</Text>
        </Group>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge
            color={
              s === "active" ? "green" : s === "rejected" ? "red" : "orange"
            }
            variant="light"
          >
            {s === "active"
              ? "Hoạt động"
              : s === "rejected"
                ? "Đã từ chối"
                : "Bị khóa"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Lịch sử",
      cell: ({ row }) => (
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconHistory size={14} />}
          onClick={() => onHistory(row.original)}
        >
          Xem lịch sử
        </Button>
      ),
    },
  ];
}
