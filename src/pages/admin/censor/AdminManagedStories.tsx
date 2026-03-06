import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  Textarea,
  Timeline,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconHistory, IconLock, IconLockOpen } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTableFilter,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import { useBanStory, useUnbanStory } from "../../../hooks/useAdminCensor";
import type { Story } from "../../../interfaces/Story";
import { format } from "../../../lib/format";
import { AdminCensorService } from "../../../services/AdminCensorService";

export function AdminManagedStories() {
  const { mutate: banStory } = useBanStory();
  const { mutate: unbanStory } = useUnbanStory();

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
          ?
        </Text>
      ),
      labels: { confirm: "Mở khóa", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        unbanStory(story._id);
      },
    });
  };

  const handleShowHistory = (story: Story) => {
    modals.open({
      title: `Lịch sử kiểm duyệt: ${story.title}`,
      size: "lg",
      children: <CensorHistory storyId={story._id} />,
    });
  };

  const dataTable = useDataTable<Story>({
    columns: getColumns(handleBan, handleUnban, handleShowHistory),
    service: AdminCensorService.getManagedStories,
    queryKey: ["managed-stories"],
  });

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Quản lý vi phạm</Title>
      </Group>

      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>
    </div>
  );
}

function CensorHistory({ storyId }: { storyId: string }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["story-censor-logs", storyId],
    queryFn: () => AdminCensorService.getStoryCensorLog(storyId),
  });

  if (isLoading) return <Text>Đang tải...</Text>;
  if (!logs || logs.length === 0)
    return <Text>Chưa có lịch sử kiểm duyệt.</Text>;

  return (
    <Timeline active={logs.length} bulletSize={24} lineWidth={2}>
      {logs.map((log) => (
        <Timeline.Item
          key={log._id}
          bullet={
            log.action === "approve" ? (
              <IconLockOpen size={12} />
            ) : log.action === "ban" || log.action === "reject" ? (
              <IconLock size={12} />
            ) : (
              <IconLockOpen size={12} />
            )
          }
          title={
            <Group gap="xs">
              <Text fw={700} size="sm">
                {log.action === "approve"
                  ? "Duyệt truyện"
                  : log.action === "reject"
                  ? "Từ chối duyệt"
                  : log.action === "ban"
                  ? "Khóa truyện"
                  : "Mở khóa truyện"}
              </Text>
              <Badge
                size="xs"
                color={
                  log.action === "approve" || log.action === "unban"
                    ? "green"
                    : "red"
                }
              >
                {log.action}
              </Badge>
            </Group>
          }
        >
          <Stack gap={4} mt={4}>
            <Group gap="xs">
              <Avatar src={log.adminId.avatar} size="xs" radius="xl" />
              <Text size="xs" fw={500}>
                {log.adminId.fullName}
              </Text>
            </Group>
            {log.reason && (
              <Text size="sm" c="dimmed">
                Lý do: {log.reason}
              </Text>
            )}
            <Text size="xs" c="dimmed">
              {format.date(new Date(log.createdAt))}
            </Text>
          </Stack>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

function getColumns(
  onBan: (story: Story) => void,
  onUnban: (story: Story) => void,
  onHistory: (story: Story) => void
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
        <Group gap="xs">
          <Avatar
            src={row.original.authorId.avatar}
            size={"sm"}
            radius={"xl"}
          />
          <div className="flex flex-col">
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
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge color={status === "active" ? "green" : "red"} variant="filled">
            {status === "active" ? "Hoạt động" : "Bị khóa"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {row.original.status === "active" ? (
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconLock size={14} />}
              onClick={() => onBan(row.original)}
            >
              Khóa
            </Button>
          ) : (
            <Button
              variant="light"
              color="green"
              size="xs"
              leftSection={<IconLockOpen size={14} />}
              onClick={() => onUnban(row.original)}
            >
              Mở khóa
            </Button>
          )}
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => onHistory(row.original)}
            title="Lịch sử kiểm duyệt"
          >
            <IconHistory size={18} />
          </ActionIcon>
        </div>
      ),
    },
  ];
}
