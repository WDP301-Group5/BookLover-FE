import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Modal,
  Progress,
  RingProgress,
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
  IconRefresh,
  IconShieldCheck,
  IconShieldFilled,
  IconShieldOff,
  IconShieldQuestion,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, ShieldQuestion } from "lucide-react";
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
  useOverrideDecision,
  useQueueStatus,
  useRejectChapter,
  useRetryFailedJobs,
  useTriggerAIAnalysis,
} from "../../../hooks/useAdminChapterCensor";
import { format } from "../../../lib/format";
import {
  AdminChapterCensorService,
  type Chapter,
} from "../../../services/AdminChapterCensorService";

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
  color: "red" | "yellow" | "green";
}) {
  const percentage = Math.round(value * 100);
  const getColor = () => {
    if (percentage >= 70) return "red";
    if (percentage >= 40) return "yellow";
    return "green";
  };

  return (
    <Box mb="xs">
      <Group justify="space-between" mb={4}>
        <Text size="xs" fw={500}>
          {label}
        </Text>
        <Text size="xs" fw={700} c={getColor()}>
          {percentage}%
        </Text>
      </Group>
      <Progress
        value={percentage}
        color={getColor()}
        size="sm"
        radius="xl"
        animated={percentage >= 70}
      />
    </Box>
  );
}

function AIScoreCard({ chapter, onClose }: { chapter: Chapter; onClose?: () => void }) {
  const { mutate: triggerAI, isPending: isTriggering } = useTriggerAIAnalysis(onClose);
  const ai = chapter.aiAnalysis;

  if (!ai) {
    return (
      <Card withBorder padding="xl" radius="md" bg="gray.0">
        <Stack gap="md" align="center">
          <IconShieldQuestion size={48} color="var(--mantine-color-gray-5)" />
          <Text size="md" fw={500} c="dimmed">
            Chưa có phân tích AI
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Nhấn nút bên dưới để phân tích nội dung chương
          </Text>
          <Button
            variant="filled"
            color="blue"
            leftSection={<IconShieldFilled size={16} />}
            loading={isTriggering}
            onClick={() => triggerAI(chapter._id)}
          >
            Phân tích với AI
          </Button>
        </Stack>
      </Card>
    );
  }

  const gemini = ai.geminiDecision;
  const maxScore = gemini
    ? Math.max(
        gemini.scores.toxicity,
        gemini.scores.sexual,
        gemini.scores.violence,
        gemini.scores.political,
      )
    : 0;

  const getDecisionInfo = () => {
    switch (ai.finalDecision) {
      case "auto-approved":
        return {
          color: "green",
          icon: <IconShieldCheck size={20} />,
          label: "An toàn - Tự động duyệt",
          description: "Nội dung đạt tiêu chuẩn",
        };
      case "flagged":
        return {
          color: "yellow",
          icon: <IconShieldQuestion size={20} />,
          label: "Cần xem xét",
          description: "AI phát hiện nội dung cần kiểm tra",
        };
      case "auto-rejected":
        return {
          color: "red",
          icon: <IconShieldOff size={20} />,
          label: "Vi phạm - Từ chối",
          description: "Nội dung vi phạm quy định sàn",
        };
      case "hard-filter-rejected":
        return {
          color: "red",
          icon: <IconShieldOff size={20} />,
          label: "Lọc từ cấm",
          description: "Chứa từ khóa bị cấm",
        };
      default:
        return {
          color: "gray",
          icon: <IconShieldQuestion size={20} />,
          label: "Không xác định",
          description: "",
        };
    }
  };

  const decisionInfo = getDecisionInfo();

  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="md">
        {/* Header - Decision Status */}
        <Card
          withBorder
          padding="sm"
          radius="md"
          bg={`${decisionInfo.color}.0`}
        >
          <Group justify="center" gap="sm">
            <Box c={decisionInfo.color}>{decisionInfo.icon}</Box>
            <Text fw={700} size="md" c={decisionInfo.color}>
              {decisionInfo.label}
            </Text>
          </Group>
          <Text size="xs" c="dimmed" ta="center" mt={4}>
            {decisionInfo.description}
          </Text>
        </Card>

        {/* Overall Score Ring */}
        {gemini && (
          <Group justify="center">
            <RingProgress
              size={120}
              thickness={12}
              roundCaps
              sections={[
                {
                  value: (1 - maxScore) * 100,
                  color:
                    maxScore >= 0.7
                      ? "red"
                      : maxScore >= 0.4
                        ? "yellow"
                        : "green",
                },
              ]}
              label={
                <Text ta="center" fw={700} size="xl">
                  {Math.round((1 - maxScore) * 100)}%
                </Text>
              }
            />
          </Group>
        )}

        {/* Score Bars */}
        {gemini && (
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Chi tiết phân tích
            </Text>
            <ScoreBar
              label="Độc hại (Toxicity)"
              value={gemini.scores.toxicity}
              color="red"
            />
            <ScoreBar
              label="Nội dung nhạy cảm (Sexual)"
              value={gemini.scores.sexual}
              color="red"
            />
            <ScoreBar
              label="Bạo lực (Violence)"
              value={gemini.scores.violence}
              color="red"
            />
            <ScoreBar
              label="Chính trị nhạy cảm (Political)"
              value={gemini.scores.political}
              color="red"
            />
          </Box>
        )}

        {/* Reasons */}
        {ai.reasons && ai.reasons.length > 0 && (
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Lý do AI đưa ra
            </Text>
            <Card withBorder padding="xs" radius="sm" bg="gray.0">
              {ai.reasons.map((reason, i) => (
                <Text key={i} size="xs" mb={4}>
                  • {reason}
                </Text>
              ))}
            </Card>
          </Box>
        )}

        {/* Warnings */}
        {gemini?.warnings && gemini.warnings.length > 0 && (
          <Box>
            <Text size="sm" fw={600} mb="xs" c="orange">
              Cảnh báo
            </Text>
            <Card withBorder padding="xs" radius="sm" bg="orange.0">
              {gemini.warnings.map((warning, i) => (
                <Text key={i} size="xs" c="orange.7">
                  ⚠️ {warning}
                </Text>
              ))}
            </Card>
          </Box>
        )}

        {/* Timestamp */}
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Thời gian phân tích:
          </Text>
          <Text size="xs" c="dimmed">
            {ai.processedAt ? format.date(new Date(ai.processedAt)) : ""}
          </Text>
        </Group>

        {/* Re-analyze Button */}
        <Button
          variant="light"
          color="blue"
          size="xs"
          leftSection={<IconRefresh size={14} />}
          loading={isTriggering}
          onClick={() => triggerAI(chapter._id)}
        >
          Phân tích lại
        </Button>
      </Stack>
    </Card>
  );
}

function QueueStatusWidget() {
  const { data: status, isLoading } = useQueueStatus();
  const { mutate: retryFailed } = useRetryFailedJobs();

  if (isLoading) return null;

  return (
    <Card withBorder padding="sm" radius="md" bg="blue.0">
      <Group justify="space-between">
        <Group gap="md">
          <Box>
            <Text size="xs" c="dimmed">
              Chờ xử lý
            </Text>
            <Text fw={700} size="lg">
              {status?.pending || 0}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              Đang xử lý
            </Text>
            <Text fw={700} size="lg">
              {status?.processing || 0}
            </Text>
          </Box>
          <Box>
            <Text size="xs" c="dimmed">
              Thất bại
            </Text>
            <Text fw={700} size="lg" c={status?.failed ? "red" : "dark"}>
              {status?.failed || 0}
            </Text>
          </Box>
        </Group>
        {status?.failed ? (
          <Button
            size="xs"
            variant="light"
            leftSection={<IconRefresh size={14} />}
            onClick={() => retryFailed()}
          >
            Retry
          </Button>
        ) : null}
      </Group>
    </Card>
  );
}

function ChapterContentFullscreenModal({
  chapter,
  opened,
  onClose,
  onApprove,
  onReject,
  onOverride,
}: {
  chapter: Chapter | null;
  opened: boolean;
  onClose: () => void;
  onApprove: (ch: Chapter) => void;
  onReject: (ch: Chapter) => void;
  onOverride: (ch: Chapter, decision: "active" | "rejected") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "ai">("content");

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
      <Box style={{ background: "var(--mantine-color-body)" }}>
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value as "content" | "ai")}
          px="md"
          pt="sm"
        >
          <Tabs.List grow>
            <Tabs.Tab value="content" leftSection={<EyeIcon size={14} />}>
              Nội dung
            </Tabs.Tab>
            <Tabs.Tab value="ai" leftSection={<ShieldQuestion size={14} />}>
              Phân tích AI
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="content">
            <ScrollArea
              h={expanded ? "calc(100vh - 10rem)" : 580}
              scrollbarSize={4}
            >
              <Box py="lg">
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
                    <ChapterReader
                      contentHtml={content || ""}
                      maxWidth="100%"
                    />
                  </Box>
                )}
              </Box>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="ai">
            <ScrollArea h={expanded ? "calc(100vh - 10rem)" : 580}>
              <Box py="lg">
                <AIScoreCard chapter={chapter} onClose={onClose} />
              </Box>
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </Box>

      <Group
        px="md"
        py="xs"
        justify="flex-end"
        style={{
          borderTop: "1px solid var(--mantine-color-default-border)",
          marginTop: 8,
        }}
      >
        {chapter.status === "pending" && chapter.aiAnalysis && (
          <Group gap="xs">
            <Button
              variant="light"
              color="orange"
              size="sm"
              leftSection={<IconX size={14} />}
              onClick={() => {
                onClose();
                onOverride(chapter, "rejected");
              }}
            >
              Override: Từ chối
            </Button>
            <Button
              variant="light"
              color="green"
              size="sm"
              leftSection={<IconCheck size={14} />}
              onClick={() => {
                onClose();
                onOverride(chapter, "active");
              }}
            >
              Override: Duyệt
            </Button>
          </Group>
        )}
        {chapter.status === "pending" ? (
          <Group gap="xs">
            <Button
              variant="light"
              color="red"
              size="sm"
              style={{ width: "10rem" }}
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
              style={{ width: "10rem" }}
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

function PendingChaptersTab() {
  const { mutate: approveChapter } = useApproveChapter();
  const { mutate: rejectChapter } = useRejectChapter();
  const { mutate: overrideDecision } = useOverrideDecision();
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

  const handleOverride = (
    chapter: Chapter,
    decision: "active" | "rejected",
  ) => {
    let reason = "";
    modals.openConfirmModal({
      title: `Override quyết định AI - ${decision === "active" ? "Duyệt" : "Từ chối"}`,
      children: (
        <Stack gap="sm">
          <Text size="sm">
            AI đã đánh giá:{" "}
            <Badge
              color={
                chapter.aiAnalysis?.finalDecision === "flagged"
                  ? "yellow"
                  : "red"
              }
            >
              {chapter.aiAnalysis?.finalDecision}
            </Badge>
          </Text>
          <Text size="sm">Nhập lý do override:</Text>
          <Textarea
            placeholder="Lý do..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </Stack>
      ),
      labels: { confirm: "Xác nhận", cancel: "Hủy" },
      confirmProps: { color: "orange" },
      onConfirm: () => {
        if (!reason.trim()) return;
        overrideDecision({ id: chapter._id, decision, reason });
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
      handleOverride,
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
        onOverride={handleOverride}
      />
    </>
  );
}

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
          <>
            <AIScoreCard chapter={selectedChapter} />
            <Box mt="md">
              <ModerationHistoryTable
                targetType="Chapter"
                targetId={selectedChapter._id}
              />
            </Box>
          </>
        )}
      </Modal>
    </>
  );
}

export function AdminChapterModeration() {
  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Kiểm duyệt Chương</Title>
        <QueueStatusWidget />
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

function getPendingChapterColumns(
  onRead: (ch: Chapter) => void,
  onApprove: (ch: Chapter) => void,
  onReject: (ch: Chapter) => void,
  onOverride: (ch: Chapter, decision: "active" | "rejected") => void,
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
      id: "aiDecision",
      header: "AI",
      cell: ({ row }) => {
        const ai = row.original.aiAnalysis;
        if (!ai)
          return (
            <Text size="xs" c="dimmed">
              Chưa phân tích
            </Text>
          );

        const color =
          ai.finalDecision === "auto-approved"
            ? "green"
            : ai.finalDecision === "flagged"
              ? "yellow"
              : "red";

        const label =
          ai.finalDecision === "auto-approved"
            ? "OK"
            : ai.finalDecision === "flagged"
              ? "Cần xem"
              : "Từ chối";

        return (
          <Badge size="xs" color={color}>
            {label}
          </Badge>
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
            <span className="hidden md:block">Đọc</span>
          </Button>
          {row.original.aiAnalysis && (
            <Button
              variant="light"
              color="orange"
              size="xs"
              leftSection={<IconCheck size={14} />}
              onClick={() => onOverride(row.original, "active")}
              title="Override: Duyệt"
            >
              OK
            </Button>
          )}
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
      id: "aiDecision",
      header: "AI",
      cell: ({ row }) => {
        const ai = row.original.aiAnalysis;
        if (!ai)
          return (
            <Text size="xs" c="dimmed">
              —
            </Text>
          );

        const color =
          ai.finalDecision === "auto-approved"
            ? "green"
            : ai.finalDecision === "flagged"
              ? "yellow"
              : "red";

        return (
          <Badge size="xs" color={color}>
            {ai.finalDecision}
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
          Xem
        </Button>
      ),
    },
  ];
}
