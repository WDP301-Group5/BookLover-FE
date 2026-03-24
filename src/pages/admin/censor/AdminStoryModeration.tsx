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
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBook,
  IconCheck,
  IconClockHour4,
  IconHistory,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  AIAnalysisBadge,
  AIRiskScore,
  AIWarnings,
} from "../../../components/admin/AIAnalysisBadge";
import { ModerationHistoryTable } from "../../../components/common/ModerationHistoryTable";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTableFilter,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import type { Story } from "../../../interfaces/Story";
import { format } from "../../../lib/format";
import { AdminCensorService } from "../../../services/AdminCensorService";
import { AdminPendingStories } from "./AdminPendingStories";

// ── Story Detail Modal ─────────────────────────────────────────────────────────
export function StoryDetailModal({
  story,
  opened,
  onClose,
  onApprove,
  onReject,
  onViewAIDetail,
}: {
  story: Story | null;
  opened: boolean;
  onClose: () => void;
  onApprove: (story: Story) => void;
  onReject: (story: Story) => void;
  onViewAIDetail?: (story: Story) => void;
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

        {/* AI Analysis Section */}
        {story.aiAnalysis && (
          <Box>
            <Divider
              label={
                <Group gap={4}>
                  <IconSparkles size={14} />
                  <Text size="xs">Phân tích AI</Text>
                </Group>
              }
              my="md"
            />
            <Group gap="lg" align="flex-start">
              <Box style={{ flex: 1 }}>
                <Text size="sm" fw={600} mb={4}>
                  Quyết định AI
                </Text>
                <Group gap="xs">
                  <AIAnalysisBadge story={story} size="md" />
                  {onViewAIDetail && (
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => onViewAIDetail(story)}
                    >
                      Chi tiết
                    </Button>
                  )}
                </Group>
              </Box>
              <Box style={{ flex: 1 }}>
                <AIRiskScore story={story} />
              </Box>
            </Group>
            <Box mt="md">
              <AIWarnings story={story} />
            </Box>
          </Box>
        )}

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
          <AdminPendingStories />
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="md">
          <HistoryStoriesTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
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
