import {
  Avatar,
  Badge,
  Button,
  Group,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import { DataTableFilter } from "../../../components/data-table/filter";
import { useApproveStory, useRejectStory } from "../../../hooks/useAdminCensor";
import type { Story } from "../../../interfaces/Story";
import { format } from "../../../lib/format";
import { AdminCensorService } from "../../../services/AdminCensorService";

export function AdminPendingStories() {
  const { mutate: approveStory } = useApproveStory();
  const { mutate: rejectStory } = useRejectStory();

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
    columns: getColumns(handleApprove, handleReject),
    service: AdminCensorService.getPendingStories,
    queryKey: ["pending-stories"],
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
    </div>
  );
}

function getColumns(
  onApprove: (story: Story) => void,
  onReject: (story: Story) => void
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
        <div className="flex items-center justify-center gap-2">
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
        </div>
      ),
    },
  ];
}
