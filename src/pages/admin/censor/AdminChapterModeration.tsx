import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconCheck,
  IconClockHour4,
  IconHistory,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
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
  useRejectChapter,
} from "../../../hooks/useAdminChapterCensor";
import { format } from "../../../lib/format";
import {
  AdminChapterCensorService,
  type Chapter,
} from "../../../services/AdminChapterCensorService";

// ── Chapter Content Fullscreen Modal ──────────────────────────────────────────
function ChapterContentFullscreenModal({
  chapter,
  opened,
  onClose,
  onApprove,
  onReject,
}: {
  chapter: Chapter | null;
  opened: boolean;
  onClose: () => void;
  onApprove: (ch: Chapter) => void;
  onReject: (ch: Chapter) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // fetch content from contentURL — must be called unconditionally (Rules of Hooks)
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
      size={expanded ? "100%" : "auto"}
      fullScreen={expanded}
      withCloseButton={false}
      title={
        <Group justify="space-between" align="center" w="100%">
          <Group gap="sm">
            <Text fw={700}>
              Chương {chapter.chapterNumber}: {chapter.title}
            </Text>
            <Badge
              size="sm"
              color={chapter.status === "pending" ? "yellow" : "gray"}
              variant="light"
            >
              {chapter.status}
            </Badge>
          </Group>

          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => setExpanded((v) => !v)}
              title={expanded ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {expanded ? (
                <IconArrowsMinimize size={18} />
              ) : (
                <IconArrowsMaximize size={18} />
              )}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={onClose}
              title="Đóng"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>
        </Group>
      }
      styles={{
        body: { padding: 0 },
        header: {
          padding: "12px 16px",
          borderBottom: "1px solid var(--mantine-color-default-border)",
        },
        title: {
          width: "100%",
        },
      }}
    >
      {/* Content */}
      <Box
        style={{
          background: "var(--mantine-color-body)",
        }}
      >
        <ScrollArea h={expanded ? "calc(100vh - 8rem)" : 680}>
          <Box px="xl" py="lg">
            {isLoading ? (
              <Text c="dimmed">Đang tải nội dung chương...</Text>
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
          </Box>
        </ScrollArea>
      </Box>

      {/* Footer actions */}
      <Group
        px="md"
        py="xs"
        justify="flex-end"
        style={{
          borderTop: "1px solid var(--mantine-color-default-border)",
          marginTop: 8,
        }}
      >
        {chapter.status === "pending" ? (
          <Group gap="xs">
            <Button
              variant="light"
              color="red"
              size="sm"
              style={{
                width: "10rem",
              }}
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
              size="sm"
              style={{
                width: "10rem",
              }}
              leftSection={<IconCheck size={14} />}
              onClick={() => {
                onClose();
                onApprove(chapter);
              }}
            >
              Phê duyệt
            </Button>
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            Chương đã được xử lý
          </Text>
        )}
      </Group>
    </Modal>
  );
}

// ── Pending Chapters Tab ───────────────────────────────────────────────────────
function PendingChaptersTab() {
  const { mutate: approveChapter } = useApproveChapter();
  const { mutate: rejectChapter } = useRejectChapter();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [chapterOpened, { open: openChapter, close: closeChapter }] =
    useDisclosure(false);

  const handleApprove = (chapter: Chapter) => {
    modals.openConfirmModal({
      title: "Phê duyệt chương",
      children: (
        <Text size="sm">
          Phê duyệt Chương {chapter.chapterNumber}:{" "}
          <Text span fw={600}>
            "{chapter.title}"
          </Text>
          ?
        </Text>
      ),
      labels: { confirm: "Phê duyệt", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => approveChapter(chapter._id),
    });
  };

  const handleReject = (chapter: Chapter) => {
    let reason = "";
    modals.openConfirmModal({
      title: "Từ chối chương",
      children: (
        <Stack gap="sm">
          <Text size="sm">
            Nhập lý do từ chối Chương {chapter.chapterNumber}:{" "}
            <Text span fw={600}>
              "{chapter.title}"
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Lý do từ chối..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </Stack>
      ),
      labels: { confirm: "Từ chối", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) return;
        rejectChapter({ id: chapter._id, reason });
      },
    });
  };

  const dataTable = useDataTable<Chapter>({
    columns: getPendingChapterColumns(
      (ch) => {
        setSelectedChapter(ch);
        openChapter();
      },
      handleApprove,
      handleReject,
    ),
    service: AdminChapterCensorService.getPendingChapters,
    queryKey: ["admin", "chapters", "pending"],
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

      <ChapterContentFullscreenModal
        chapter={selectedChapter}
        opened={chapterOpened}
        onClose={closeChapter}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

// ── History Chapters Tab ───────────────────────────────────────────────────────
function HistoryChaptersTab() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [historyOpened, { open: openHistory, close: closeHistory }] =
    useDisclosure(false);

  const dataTable = useDataTable<Chapter>({
    columns: getHistoryChapterColumns((ch) => {
      setSelectedChapter(ch);
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
            Lịch sử: Chương {selectedChapter?.chapterNumber} —{" "}
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

// ── Main Page ──────────────────────────────────────────────────────────────────
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

// ── Column definitions ─────────────────────────────────────────────────────────
function getPendingChapterColumns(
  onRead: (ch: Chapter) => void,
  onApprove: (ch: Chapter) => void,
  onReject: (ch: Chapter) => void,
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
      accessorKey: "createdAt",
      header: "Ngày gửi",
      cell: ({ row }) => format.date(new Date(row.original.createdAt ?? "")),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <Group gap="xs" justify="center">
          <Button
            variant="light"
            color="blue"
            size="xs"
            leftSection={<EyeIcon size={14} />}
            onClick={() => onRead(row.original)}
          >
            <span className="hidden md:block">Đọc nội dung</span>
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

function getHistoryChapterColumns(
  onHistory: (ch: Chapter) => void,
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
          | { _id: string; title: string }
          | string
          | undefined;
        if (!story || typeof story === "string")
          return (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        return <Text size="sm">{story.title}</Text>;
      },
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
            {s}
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
