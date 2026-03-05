import { ActionIcon, Badge, Button, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconPlus, IconTrash, IconUser } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
	column,
	DataTable,
	DataTableColumns,
	DataTableContent,
	DataTablePagination,
	useDataTable,
} from "../../../components/data-table";
import { DataTableFilter } from "../../../components/data-table/filter";
import { useDeleteAdmin, useDeleteManyAdmins } from "../../../hooks/useAdmin";
import type { AdminUser } from "../../../interfaces/AdminUser";
import { format } from "../../../lib/format";
import { AdminService } from "../../../services/AdminService";
import { useUserStore } from "../../../stores/useUserStore";
import { CreateAdminModal } from "./CreateAdminModal";
import { EditAdminModal } from "./EditAdminModal";

export function AdminAccountManagement() {
	const [createOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [editOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);
	const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

	const { mutate: deleteAdmin } = useDeleteAdmin();
	const { mutate: deleteManyAdmins } = useDeleteManyAdmins();
	const { user: currentUser } = useUserStore();

	const handleDelete = (user: AdminUser) => {
		// Prevent self-deletion
		if (user._id === currentUser?.id) {
			modals.open({
				title: "Không thể xóa",
				children: (
					<Text size="sm">Bạn không thể xóa chính tài khoản của mình.</Text>
				),
			});
			return;
		}

		modals.openConfirmModal({
			title: "Xác nhận xóa",
			children: (
				<Text size="sm">
					Bạn có chắc chắn muốn xóa người dùng{" "}
					<Text span fw={600}>
						"{user.fullName}"
					</Text>
					? Hành động này không thể hoàn tác.
				</Text>
			),
			labels: { confirm: "Xóa", cancel: "Hủy" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				deleteAdmin(user._id);
			},
		});
	};

	const handleOpenEdit = (user: AdminUser) => {
		setEditingUser(user);
		openEdit();
	};

	const dataTable = useDataTable<AdminUser>({
		columns: getColumns(handleOpenEdit, handleDelete, currentUser?.id || ""),
		service: AdminService.getAll,
		queryKey: ["admins"],
	});

	const selectedRowCount = dataTable.table.getSelectedRowModel().rows.length;

	const handleDeleteSelected = () => {
		const selectedRows = dataTable.table.getSelectedRowModel().rows;
		const selectedUsers = selectedRows.map((row) => row.original);
		const ids = selectedUsers.map((u) => u._id);
		const count = ids.length;

		// Check if trying to delete self
		if (currentUser?.id && ids.includes(currentUser.id)) {
			modals.open({
				title: "Không thể xóa",
				children: (
					<Text size="sm">
						Bạn không thể xóa chính tài khoản của mình. Vui lòng bỏ chọn tài
						khoản này.
					</Text>
				),
			});
			return;
		}

		modals.openConfirmModal({
			title: "Xác nhận xóa",
			children: (
				<Text size="sm">
					Bạn có chắc chắn muốn xóa{" "}
					<Text span fw={600}>
						{count}
					</Text>{" "}
					người dùng đã chọn? Hành động này không thể hoàn tác.
				</Text>
			),
			labels: { confirm: "Xóa", cancel: "Hủy" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				deleteManyAdmins(ids);
				dataTable.table.resetRowSelection();
			},
		});
	};

	const handleCloseCreate = () => {
		closeCreate();
	};

	const handleCloseEdit = () => {
		closeEdit();
		setEditingUser(null);
	};

	return (
		<div className="space-y-4">
			<Group justify="space-between" align="center">
				<Title order={2}>Quản lý quản trị viên</Title>
				<Group gap="xs">
					<Button
						leftSection={<IconTrash size={18} />}
						onClick={handleDeleteSelected}
						disabled={selectedRowCount === 0}
						color="red"
						variant="filled"
					>
						Xóa ({selectedRowCount})
					</Button>
					<Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
						Tạo mới
					</Button>
				</Group>
			</Group>

			<DataTable dataTable={dataTable}>
				<div className="flex items-center justify-between gap-4">
					<DataTableFilter />
					<DataTableColumns />
				</div>
				<DataTableContent />
				<DataTablePagination />
			</DataTable>

			{/* Create Modal */}
			<CreateAdminModal opened={createOpened} onClose={handleCloseCreate} />

			{/* Edit Modal */}
			<EditAdminModal
				opened={editOpened}
				onClose={handleCloseEdit}
				user={editingUser}
			/>
		</div>
	);
}

function getColumns(
	onEdit: (user: AdminUser) => void,
	onDelete: (user: AdminUser) => void,
	currentUserId: string,
): ColumnDef<AdminUser>[] {
	const handleDeleteClick = (user: AdminUser) => {
		if (user._id === currentUserId) {
			modals.open({
				title: "Không thể xóa",
				children: (
					<Text size="sm">Bạn không thể xóa chính tài khoản của mình.</Text>
				),
			});
			return;
		}

		modals.openConfirmModal({
			title: "Xác nhận xóa",
			children: (
				<Text size="sm">
					Bạn có chắc chắn muốn xóa người dùng{" "}
					<Text span fw={600}>
						"{user.fullName}"
					</Text>
					? Hành động này không thể hoàn tác.
				</Text>
			),
			labels: { confirm: "Xóa", cancel: "Hủy" },
			confirmProps: { color: "red" },
			onConfirm: () => onDelete(user),
		});
	};

	return [
		column.select(),
		{
			accessorKey: "avatarURL",
			header: "Avatar",
			cell: ({ row }) => (
				<div className="size-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
					{row.original.avatarURL ? (
						<img
							src={row.original.avatarURL}
							alt={row.original.fullName}
							className="size-full object-cover"
						/>
					) : (
						<IconUser size={20} className="text-gray-400" />
					)}
				</div>
			),
		},
		{
			accessorKey: "username",
			header: "Username",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "fullName",
			header: "Họ tên",
		},
		{
			accessorKey: "role",
			header: "Vai trò",
			cell: ({ row }) => {
				const role = row.original.role;
				const colorMap: Record<string, string> = {
					admin: "red",
					author: "blue",
					user: "gray",
				};
				return (
					<Badge color={colorMap[role] || "gray"} variant="filled">
						{role === "admin"
							? "Quản trị viên"
							: role === "author"
								? "Tác giả"
								: "Người dùng"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Trạng thái",
			cell: ({ row }) => {
				const status = row.original.status;
				const colorMap: Record<string, string> = {
					active: "green",
					inactive: "gray",
					banned: "red",
				};
				return (
					<Badge color={colorMap[status] || "gray"} variant="filled">
						{status === "active"
							? "Hoạt động"
							: status === "inactive"
								? "Không hoạt động"
								: "Bị khóa"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Ngày tạo",
			cell: ({ row }) =>
				row.original.createdAt
					? format.date(new Date(row.original.createdAt))
					: "-",
		},
		{
			accessorKey: "updatedAt",
			header: "Ngày sửa",
			cell: ({ row }) =>
				row.original.updatedAt
					? format.date(new Date(row.original.updatedAt))
					: "-",
		},
		{
			id: "actions",
			header: "Hành động",
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-2">
					<ActionIcon
						variant="transparent"
						onClick={() => onEdit(row.original)}
					>
						<IconEdit size={16} />
					</ActionIcon>
					<ActionIcon
						variant="transparent"
						color="red"
						onClick={() => handleDeleteClick(row.original)}
					>
						<IconTrash size={16} />
					</ActionIcon>
				</div>
			),
		},
	];
}
