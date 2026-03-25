import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Menu,
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
  IconBrain,
  IconCheck,
  IconClockHour4,
  IconDotsVertical,
  IconHistory,
  IconInfoCircle,
  IconLock,
  IconLockOff,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ChapterAIAnalysisBadge } from "../../../components/admin/ChapterAIAnalysisBadge";
import { ChapterAIAnalysisDetailModal } from "../../../components/admin/ChapterAIAnalysisDetailModal";
import { ChapterReader } from "../../../components/chapter/ChapterReader";
import { ModerationHistoryTable } from "../../../components/common/ModerationHistoryTable";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTableFilter,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import {
  useApproveChapter,
  useBanChapter,
  useRejectChapter,
  useTriggerAIAnalysis,
  useUnbanChapter,
} from "../../../hooks/useAdminChapterCensor";
import { format } from "../../../lib/format";
import {
  AdminChapterCensorService,
  type Chapter,
} from "../../../services/AdminChapterCensorService";

// ── Chapter Detail Modal ─────────────────────────────────────────────────────────
function ChapterDetailModal({
  chapter,
  opened,
  onClose,
  onApprove,
  onReject,
  onViewAIDetail,
  onAnalyze,
  isAnalyzing,
  onBan,
  onUnban,
}: {
  chapter: Chapter | null;
  opened: boolean;
  onClose: () => void;
  onApprove: (ch: Chapter) => void;
  onReject: (ch: Chapter) => void;
  onViewAIDetail?: (ch: Chapter) => void;
  onAnalyze?: (ch: Chapter) => void;
  isAnalyzing?: boolean;
  onBan?: (ch: Chapter) => void;
  onUnban?: (ch: Chapter) => void;
}) {
  const { data: content, isLoading } = useQuery({
    queryKey: ["admin", "chapter-content", chapter?._id],
    queryFn: async () => {
      if (!chapter) return "";
      const r = await fetch(chapter.contentURL);
      return r.text();
    },
    enabled: opened && !!chapter,
  });

  if (!chapter) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Chương {chapter.chapterNumber}: {chapter.title}
        </Text>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Chapter Info */}
        <Group align="flex-start" gap="md">
          <Box style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Thuộc truyện
            </Text>
            {typeof chapter.storyId === "object" &&
              chapter.storyId !== null && (
                <Group gap="xs">
                  <Avatar
                    src={(chapter.storyId as { image?: string }).image}
                    size="sm"
                    radius="sm"
                  />
                  <Text size="sm" fw={500}>
                    {(chapter.storyId as { title: string }).title}
                  </Text>
                </Group>
              )}
            <Text size="sm" c="dimmed" mt={4}>
              Ngày gửi
            </Text>
            <Text size="sm">
              {chapter.createdAt
                ? format.date(new Date(chapter.createdAt))
                : "—"}
            </Text>
          </Box>
        </Group>

        {/* AI Analysis Section */}
        {chapter.aiAnalysis && (
          <Box>
            <Table withTableBorder withColumnBorders variant="simple">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Phân tích AI</Table.Th>
                  <Table.Th>Chi tiết</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <ChapterAIAnalysisBadge
                      aiAnalysis={chapter.aiAnalysis}
                      size="md"
                    />
                  </Table.Td>
                  <Table.Td>
                    {onViewAIDetail && (
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => onViewAIDetail(chapter)}
                      >
                        Chi tiết
                      </Button>
                    )}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Box>
        )}

        {/* Re-analyze Button */}
        {onAnalyze && chapter.status === "pending" && (
          <Button
            variant="light"
            color="blue"
            leftSection={<IconRefresh size={14} />}
            loading={isAnalyzing}
            onClick={() => onAnalyze(chapter)}
          >
            Phân tích lại với AI
          </Button>
        )}

        <Divider
          label={
            <Group gap={4}>
              <IconBook size={14} />
              <Text size="xs">Nội dung chương</Text>
            </Group>
          }
        />

        {/* Chapter Content */}
        {isLoading ? (
          <Text size="sm">Đang tải nội dung...</Text>
        ) : (
          <Box
            component="section"
            mx="auto"
            style={{
              maxWidth: 800,
              borderRadius: "12px",
              border: "1px solid var(--mantine-color-default-border)",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              backgroundColor: "var(--mantine-color-body)",
              padding: "20px 24px",
            }}
          >
            <ChapterReader contentHtml={content || ""} maxWidth="100%" />
          </Box>
        )}

        <Divider />

        {/* Actions */}
        {chapter.status === "pending" && (
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="red"
              leftSection={<IconX size={14} />}
              onClick={() => {
                onClose();
                onReject(chapter);
              }}
            >
              Từ chối
            </Button>
            <Button
              color="green"
              leftSection={<IconCheck size={14} />}
              onClick={() => {
                onClose();
                onApprove(chapter);
              }}
            >
              Phê duyệt
            </Button>
          </Group>
        )}
        {chapter.status === "banned" && onUnban && (
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="green"
              leftSection={<IconLockOff size={14} />}
              onClick={() => {
                onClose();
                onUnban(chapter);
              }}
            >
              Mở khóa
            </Button>
          </Group>
        )}
        {chapter.status === "active" && onBan && (
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="orange"
              leftSection={<IconLock size={14} />}
              onClick={() => {
                onClose();
                onBan(chapter);
              }}
            >
              Khóa
            </Button>
          </Group>
        )}
      </Stack>
    </Modal>
  );
}

// ── Pending Tab ──────────────────────────────────────────────────────────────────
function PendingChaptersTab() {
  const queryClient = useQueryClient();
  const { mutate: approveChapter } = useApproveChapter();
  const { mutate: rejectChapter } = useRejectChapter();
  const { mutate: banChapter } = useBanChapter();
  const { mutate: unbanChapter } = useUnbanChapter();
  const [analyzingChapterId, setAnalyzingChapterId] = useState<string | null>(
    null,
  );
  const { mutate: analyzeChapter, isPending: isAnalyzing } =
    useTriggerAIAnalysis(() => {
      // Refetch the data table after AI analysis completes
      queryClient.invalidateQueries({
        queryKey: ["admin", "chapters", "pending"],
      });
    });
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [
    chapterDetailOpened,
    { open: openChapterDetail, close: closeChapterDetail },
  ] = useDisclosure(false);
  const [aiDetailOpened, { open: openAIDetail, close: closeAIDetail }] =
    useDisclosure(false);

  const handleViewChapterDetail = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    openChapterDetail();
  };

  const handleViewAIDetail = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    openAIDetail();
  };

  const handleAnalyze = (chapter: Chapter) => {
    setAnalyzingChapterId(chapter._id);
    analyzeChapter(chapter._id, {
      onSettled: () => {
        setAnalyzingChapterId(null);
      },
    });
  };

  const handleBan = (chapter: Chapter) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Khóa chương",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Vui lòng nhập lý do khóa chương{" "}
            <Text span fw={600}>
              "#{chapter.chapterNumber}: {chapter.title}"
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
        banChapter({ id: chapter._id, reason });
      },
    });
  };

  const handleUnban = (chapter: Chapter) => {
    modals.openConfirmModal({
      title: "Mở khóa chương",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn mở khóa chương{" "}
          <Text span fw={600}>
            "#{chapter.chapterNumber}: {chapter.title}"
          </Text>
          ? Chương sẽ được hiển thị trở lại.
        </Text>
      ),
      labels: { confirm: "Mở khóa", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        unbanChapter(chapter._id);
      },
    });
  };

  const handleApprove = (chapter: Chapter) => {
    modals.openConfirmModal({
      title: "Xác nhận duyệt",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn duyệt chương{" "}
          <Text span fw={600}>
            "#{chapter.chapterNumber}: {chapter.title}"
          </Text>
          ?
        </Text>
      ),
      labels: { confirm: "Duyệt", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        approveChapter(chapter._id);
      },
    });
  };

  const handleReject = (chapter: Chapter) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Từ chối duyệt chương",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Vui lòng nhập lý do từ chối chương{" "}
            <Text span fw={600}>
              "#{chapter.chapterNumber}: {chapter.title}"
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
        rejectChapter({ id: chapter._id, reason });
      },
    });
  };

  const dataTable = useDataTable<Chapter>({
    columns: getColumns(
      handleApprove,
      handleReject,
      handleAnalyze,
      analyzingChapterId,
      handleViewChapterDetail,
      handleViewAIDetail,
      handleBan,
      handleUnban,
    ),
    service: () => AdminChapterCensorService.getPendingChapters(),
    queryKey: ["admin", "chapters", "pending"],
  });

  return (
    <div className="space-y-4">
      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <ChapterAIAnalysisDetailModal
        chapter={selectedChapter!}
        opened={aiDetailOpened}
        onClose={closeAIDetail}
      />

      <ChapterDetailModal
        chapter={selectedChapter}
        opened={chapterDetailOpened}
        onClose={closeChapterDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewAIDetail={handleViewAIDetail}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        onBan={handleBan}
        onUnban={handleUnban}
      />
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────────
function HistoryChaptersTab() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [historyOpened, { open: openHistory, close: closeHistory }] =
    useDisclosure(false);

  const dataTable = useDataTable<Chapter>({
    columns: getHistoryColumns((chapter) => {
      setSelectedChapter(chapter);
      openHistory();
    }),
    service: AdminChapterCensorService.getManagedChapters,
    queryKey: ["admin", "chapters", "managed"],
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
        title={
          <Text fw={700}>
            Lịch sử kiểm duyệt: Chương {selectedChapter?.chapterNumber} —{" "}
            {selectedChapter?.title}
          </Text>
        }
        size="lg"
      >
        {selectedChapter && (
          <ModerationHistoryTable
            targetType="Chapter"
            targetId={selectedChapter._id}
          />
        )}
      </Modal>
    </>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────────
export function AdminChapterModeration() {
  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Kiểm duyệt Chương</Title>
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
          <PendingChaptersTab />
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="md">
          <HistoryChaptersTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

// ── Column definitions ───────────────────────────────────────────────────────────
function getColumns(
  onApprove: (chapter: Chapter) => void,
  onReject: (chapter: Chapter) => void,
  onAnalyze: (chapter: Chapter) => void,
  analyzingChapterId: string | null,
  onViewChapterDetail: (chapter: Chapter) => void,
  onViewAIDetail: (chapter: Chapter) => void,
  onBan: (chapter: Chapter) => void,
  onUnban: (chapter: Chapter) => void,
): ColumnDef<Chapter>[] {
  return [
    {
      accessorKey: "chapterNumber",
      header: "Chương",
      cell: ({ row }) => <Text fw={600}>#{row.original.chapterNumber}</Text>,
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => <Text size="sm">{row.original.title}</Text>,
    },
    {
      id: "story",
      header: "Thuộc truyện",
      cell: ({ row }) => {
        const story = row.original.storyId as
          | { _id: string; title: string; image?: string }
          | string
          | undefined;
        if (!story || typeof story === "string")
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        return (
          <Group gap="xs" className="flex-nowrap whitespace-nowrap">
            <Avatar src={story.image} size="sm" radius="sm" />
            <Text size="sm" fw={500}>
              {story.title}
            </Text>
          </Group>
        );
      },
    },
    {
      accessorKey: "aiAnalysis",
      header: "Phân tích",
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <ChapterAIAnalysisBadge aiAnalysis={row.original.aiAnalysis} />
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
      cell: ({ row }) =>
        row.original.createdAt
          ? format.date(new Date(row.original.createdAt))
          : "—",
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <Menu shadow="md" width={200} position="bottom-end" closeOnItemClick>
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
              disabled={analyzingChapterId !== null}
            >
              {analyzingChapterId === row.original._id ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                  Đang phân tích...
                </span>
              ) : row.original.aiAnalysis ? (
                "Phân tích lại"
              ) : (
                "Phân tích"
              )}
            </Menu.Item>
            {row.original.aiAnalysis && (
              <Menu.Item
                leftSection={<IconInfoCircle size={14} />}
                onClick={() => onViewAIDetail(row.original)}
              >
                Xem phân tích
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconBook size={14} />}
              onClick={() => onViewChapterDetail(row.original)}
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

function getHistoryColumns(
  onHistory: (chapter: Chapter) => void,
): ColumnDef<Chapter>[] {
  return [
    {
      accessorKey: "chapterNumber",
      header: "Chương",
      cell: ({ row }) => <Text fw={600}>#{row.original.chapterNumber}</Text>,
    },
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => <Text size="sm">{row.original.title}</Text>,
    },
    {
      id: "story",
      header: "Thuộc truyện",
      cell: ({ row }) => {
        const story = row.original.storyId as
          | { _id: string; title: string; image?: string }
          | string
          | undefined;
        if (!story || typeof story === "string")
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        return (
          <Group gap="xs">
            <Avatar src={story.image} size="sm" radius="sm" />
            <Text size="sm">{story.title}</Text>
          </Group>
        );
      },
    },
    {
      accessorKey: "aiAnalysis",
      header: "Phân tích",
      cell: ({ row }) => (
        <Group gap="xs" wrap="nowrap">
          <ChapterAIAnalysisBadge aiAnalysis={row.original.aiAnalysis} />
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
            size="xs"
            color={
              s === "active"
                ? "green"
                : s === "rejected"
                  ? "red"
                  : s === "banned"
                    ? "orange"
                    : "gray"
            }
            variant="light"
          >
            {s === "active"
              ? "Hoạt động"
              : s === "rejected"
                ? "Từ chối"
                : s === "banned"
                  ? "Bị khóa"
                  : s}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Ngày cập nhật",
      cell: ({ row }) =>
        row.original.updatedAt
          ? format.date(new Date(row.original.updatedAt))
          : "—",
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
          Xem
        </Button>
      ),
    },
  ];
}
