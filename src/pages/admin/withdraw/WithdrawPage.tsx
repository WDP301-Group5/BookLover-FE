import {
    ActionIcon,
    Badge,
    Group,
    Menu,
    Title,
} from "@mantine/core";
import { IconCheck, IconDotsVertical, IconX } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
    column,
    DataTable,
    DataTableColumns,
    DataTableContent,
    DataTablePagination,
    useDataTable,
} from "../../../components/data-table";
import { format } from "../../../lib/format";
import WithdrawService from "../../../services/WithdrawService";
import { showError, showSuccess } from "../../../utils/notifications";

export type ManagedWithdraw = {
    _id: string;
    userId: {
        _id: string;
        fullName: string;
        email: string;
    };
    amount: number;
    phoneNumber: string;
    status: "pending" | "success" | "failed" | "cancelled";
    createdAt: string;
};

const WithdrawPage = () => {

    const handleUpdateStatus = async (id: string, status: string) => {
        const data = await WithdrawService.updateWithdraw(id, status);
        if (data) {
            showSuccess("Cập nhật trạng thái thành công.")
        } else {
            showError("Cập nhật trạng thái thất bại.")
        }
    }


    const columns = useMemo(
        () =>
            getColumns({
                onApprove: (item) =>
                    handleUpdateStatus(item._id, "success"),
                onReject: (item) =>
                    handleUpdateStatus(item._id, "failed"),
            }),
        [],
    );

    const dataTable = useDataTable<ManagedWithdraw>({
        columns,
        service: async () => {
            const res = await WithdrawService.getAllWithdraws();
            return res.data;
        },
        queryKey: ["allWithdraws"],
    });

    return (
        <div className="space-y-4">
            <Group justify="space-between">
                <Title order={2}>Quản lý rút tiền</Title>
            </Group>

            <DataTable dataTable={dataTable}>
                <div className="flex justify-between">
                    <DataTableColumns />
                </div>

                <DataTableContent />
                <DataTablePagination />
            </DataTable>
        </div>
    );
}

function getColumns({
    onApprove,
    onReject,
}: {
    onApprove: (item: ManagedWithdraw) => void;
    onReject: (item: ManagedWithdraw) => void;
}): ColumnDef<ManagedWithdraw>[] {
    return [
        column.select(),

        {
            accessorKey: "userId.fullName",
            header: "Người dùng",
            cell: ({ row }) => row.original.userId?.fullName || "-",
        },

        {
            accessorKey: "userId.email",
            header: "Email",
            cell: ({ row }) => row.original.userId?.email || "-",
        },

        {
            accessorKey: "amount",
            header: "Số tiền",
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    {row.original.amount.toLocaleString()} VND
                </span>
            ),
        },

        {
            accessorKey: "phoneNumber",
            header: "SĐT nhận",
        },

        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original.status;

                const map = {
                    pending: { color: "yellow", label: "Chờ duyệt" },
                    success: { color: "green", label: "Thành công" },
                    failed: { color: "red", label: "Từ chối" },
                    cancelled: { color: "gray", label: "Hủy" },
                };

                return (
                    <Badge color={map[status]?.color} variant="filled">
                        {map[status]?.label}
                    </Badge>
                );
            },
        },

        {
            accessorKey: "createdAt",
            header: "Ngày yêu cầu",
            cell: ({ row }) =>
                format.date(new Date(row.original.createdAt)),
        },

        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {item.status === "pending" && (
                                <>
                                    <Menu.Item
                                        color="green"
                                        leftSection={<IconCheck size={16} />}
                                        onClick={() => onApprove(item)}
                                    >
                                        Duyệt
                                    </Menu.Item>

                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconX size={16} />}
                                        onClick={() => onReject(item)}
                                    >
                                        Từ chối
                                    </Menu.Item>
                                </>
                            )}

                            {item.status !== "pending" && (
                                <Menu.Label>Đã xử lý</Menu.Label>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                );
            },
        },
    ];
}

export default WithdrawPage;