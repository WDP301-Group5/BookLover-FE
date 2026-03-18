import { useMemo, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Menu,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTableFilter,
  DataTablePagination,
  column,
  useDataTable,
} from "../../../components/data-table";
import { AdminTransactionService } from "../../../services/AdminTransactionService";
import { EditTransactionModal } from "./EditTransactionModal";
import { BanTransactionModal } from "./BanTransactionModal";
import type { ManagedTransaction } from "../../../interfaces/transaction";
import type { ColumnDef } from "@tanstack/react-table";
import {
  IconBan,
  IconBook,
  IconCheck,
  IconCoins,
  IconDotsVertical,
  IconEdit,
  IconReceipt2,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";

const STONE_TO_VND = 1000;

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("vi-VN").format(value || 0);

const formatVND = (stones?: number) => {
  const value = (stones || 0) * STONE_TO_VND;
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
};

const formatStoneAndVND = (stones?: number) => {
  const safe = stones || 0;
  return `${safe} LT (${new Intl.NumberFormat("vi-VN").format(
    safe * STONE_TO_VND
  )} VND)`;
};

export function AdminTransactionPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<ManagedTransaction | null>(null);
  const [banningTransaction, setBanningTransaction] =
    useState<ManagedTransaction | null>(null);

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [banOpened, { open: openBan, close: closeBan }] =
    useDisclosure(false);

  const handleOpenEdit = (transaction: ManagedTransaction) => {
    setEditingTransaction(transaction);
    openEdit();
  };

  const handleOpenBan = (transaction: ManagedTransaction) => {
    setBanningTransaction(transaction);
    openBan();
  };

  const handleCloseEdit = () => {
    setEditingTransaction(null);
    closeEdit();
  };

  const handleCloseBan = () => {
    setBanningTransaction(null);
    closeBan();
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleOpenEdit,
        onBan: handleOpenBan,
        onUnban: async (transaction) => {
          await AdminTransactionService.updateStatus(transaction.id, "success");
        },
        onChangeStatus: async (transaction, nextStatus) => {
          await AdminTransactionService.updateStatus(transaction.id, nextStatus);
        },
      }),
    []
  );

  const dataTable = useDataTable<ManagedTransaction>({
    columns,
    service: async () => {
      const res = await AdminTransactionService.getAll({
        page: 1,
        limit: 20,
        keyword: keyword || undefined,
        status: status || undefined,
      });
      return res.data;
    },
    queryKey: ["managed-transactions", keyword, status],
  });

  const rows = (dataTable.data ?? []) as ManagedTransaction[];

  const summary = useMemo(() => {
    const totalTransactions = rows.length;
    const successCount = rows.filter((item) => item.status === "success").length;
    const failedCount = rows.filter((item) => item.status === "failed").length;
    const pendingCount = rows.filter((item) => item.status === "pending").length;

    const totalAdminShare = rows.reduce(
      (sum, item) => sum + (item.adminShare ?? item.spiritStones * 0.4),
      0
    );

    const totalAuthorShare = rows.reduce(
      (sum, item) => sum + (item.authorShare ?? item.spiritStones * 0.6),
      0
    );

    return {
      totalTransactions,
      successCount,
      failedCount,
      pendingCount,
      totalAdminShare,
      totalAuthorShare,
    };
  }, [rows]);

  return (
    <div className="space-y-4">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Card withBorder radius="lg" padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                Tổng giao dịch
              </Text>
              <Title order={3}>{formatNumber(summary.totalTransactions)}</Title>
            </div>
            <ThemeIcon variant="light" size={42} radius="xl">
              <IconReceipt2 size={22} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder radius="lg" padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                Admin nhận
              </Text>
              <Title order={4}>{formatVND(summary.totalAdminShare)}</Title>
              <Text size="xs" c="dimmed">
                {formatStoneAndVND(summary.totalAdminShare)}
              </Text>
            </div>
            <ThemeIcon variant="light" color="blue" size={42} radius="xl">
              <IconWallet size={22} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder radius="lg" padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">
                Tác giả nhận
              </Text>
              <Title order={4}>{formatVND(summary.totalAuthorShare)}</Title>
              <Text size="xs" c="dimmed">
                {formatStoneAndVND(summary.totalAuthorShare)}
              </Text>
            </div>
            <ThemeIcon variant="light" color="grape" size={42} radius="xl">
              <IconCoins size={22} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder radius="lg" padding="lg">
          <Stack gap={6}>
            <Text size="sm" c="dimmed">
              Trạng thái
            </Text>
            <Group gap="xs">
              <Badge color="green" variant="light">
                Thành công: {summary.successCount}
              </Badge>
              <Badge color="yellow" variant="light">
                Chờ xử lý: {summary.pendingCount}
              </Badge>
              <Badge color="red" variant="light">
                Thất bại: {summary.failedCount}
              </Badge>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>

      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      <EditTransactionModal
        opened={editOpened}
        onClose={handleCloseEdit}
        transaction={editingTransaction}
      />

      <BanTransactionModal
        opened={banOpened}
        onClose={handleCloseBan}
        transactionId={banningTransaction?.id}
        loading={false}
        onConfirm={async () => {
          if (!banningTransaction) return;
          await AdminTransactionService.updateStatus(
            banningTransaction.id,
            "failed"
          );
          handleCloseBan();
        }}
      />
    </div>
  );
}

function getColumns({
  onEdit,
  onBan,
  onUnban,
  onChangeStatus,
}: {
  onEdit: (transaction: ManagedTransaction) => void;
  onBan: (transaction: ManagedTransaction) => void;
  onUnban: (transaction: ManagedTransaction) => void;
  onChangeStatus: (
    transaction: ManagedTransaction,
    nextStatus: "success" | "failed" | "pending"
  ) => void;
}): ColumnDef<ManagedTransaction>[] {
  return [
    column.select(),
    {
      accessorKey: "id",
      header: "Mã giao dịch",
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate font-medium">
          {row.original.id}
        </div>
      ),
    },
    {
      accessorKey: "avatarURL",
      header: "Người dùng",
      cell: ({ row }) => {
        const user = row.original.userId;
        return (
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="size-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.avatarURL ? (
                <img
                  src={user.avatarURL}
                  className="size-full object-cover"
                  alt={user.username || user.email}
                />
              ) : (
                <IconUser size={20} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">
                {user?.username || "Không có username"}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user?.email || "Không có email"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "chapterId",
      header: "Thông tin truyện",
      cell: ({ row }) => {
        const chapter = row.original.chapterId;
        const story = chapter?.storyId;

        return (
          <div className="min-w-[220px]">
            <div className="flex items-center gap-2 font-medium">
              <IconBook size={16} />
              <span className="truncate">
                {story?.title || "Không có truyện"}
              </span>
            </div>
            <div className="text-sm text-gray-500 truncate">
              Chapter: {chapter?.title || "Không có chapter"}
            </div>
            <div className="text-xs text-gray-400">
              Giá: {formatStoneAndVND(chapter?.price || row.original.spiritStones)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "author",
      header: "Tác giả",
      cell: ({ row }) => {
        const author = row.original.chapterId?.storyId?.authorId;

        return (
          <div className="min-w-[180px]">
            <div className="font-medium">
              {author?.username || "Không có tác giả"}
            </div>
            <div className="text-sm text-gray-500">
              {author?.email || ""}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "stoneBefore",
      header: "Trước GD",
      cell: ({ row }) => formatStoneAndVND(row.original.stoneBefore),
    },
    {
      accessorKey: "spiritStones",
      header: "Chi tiêu",
      cell: ({ row }) => formatStoneAndVND(row.original.spiritStones),
    },
    {
      accessorKey: "stoneAfter",
      header: "Sau GD",
      cell: ({ row }) => formatStoneAndVND(row.original.stoneAfter),
    },
    {
      accessorKey: "adminShare",
      header: "Admin nhận",
      cell: ({ row }) => {
        const adminShare =
          row.original.adminShare ?? row.original.spiritStones * 0.4;
        return (
          <div className="min-w-[150px]">
            <div className="font-medium text-blue-600">
              {formatVND(adminShare)}
            </div>
            <div className="text-xs text-gray-500">
              {adminShare} LT
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "authorShare",
      header: "Tác giả nhận",
      cell: ({ row }) => {
        const authorShare =
          row.original.authorShare ?? row.original.spiritStones * 0.6;
        return (
          <div className="min-w-[150px]">
            <div className="font-medium text-violet-600">
              {formatVND(authorShare)}
            </div>
            <div className="text-xs text-gray-500">
              {authorShare} LT
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorMap: Record<string, string> = {
          success: "green",
          failed: "red",
          pending: "yellow",
        };

        return (
          <Badge color={colorMap[status] || "gray"} variant="filled">
            {status === "success"
              ? "Thành công"
              : status === "failed"
              ? "Thất bại"
              : "Đang xử lý"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString("vi-VN"),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <Menu shadow="md" width={220}>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => onEdit(transaction)}
              >
                Chỉnh sửa
              </Menu.Item>

              <Menu.Item
                leftSection={<IconBan size={16} />}
                onClick={() => onBan(transaction)}
              >
                Khóa giao dịch
              </Menu.Item>

              <Menu.Item
                color="green"
                leftSection={<IconCheck size={16} />}
                onClick={() => onUnban(transaction)}
              >
                Mở khóa giao dịch
              </Menu.Item>

              <Menu.Label>Thay đổi trạng thái</Menu.Label>
              <Menu.Item
                onClick={() => onChangeStatus(transaction, "success")}
              >
                Đặt là Thành công
              </Menu.Item>
              <Menu.Item
                onClick={() => onChangeStatus(transaction, "failed")}
              >
                Đặt là Thất bại
              </Menu.Item>
              <Menu.Item
                onClick={() => onChangeStatus(transaction, "pending")}
              >
                Đặt là Đang xử lý
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        );
      },
    },
  ];
}