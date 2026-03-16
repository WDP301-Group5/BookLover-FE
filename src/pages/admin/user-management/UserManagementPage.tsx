import {
	ActionIcon,
	Badge,
	Group,
	Menu,
	Select,
	TextInput,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconBan,
	IconCheck,
	IconDotsVertical,
	IconEdit,
	IconSearch,
	IconUser,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
	column,
	DataTable,
	DataTableColumns,
	DataTableContent,
	DataTablePagination,
	useDataTable,
} from "../../../components/data-table";
import type { ManagedUser } from "../../../interfaces/UserManagement";
import { format } from "../../../lib/format";
import { BanUserModal } from "./BanUserModal";
import { EditUserModal } from "./EditUserModal";
import { useBanManagedUser, useUnbanManagedUser, useUpdateManagedUserRole, useUpdateManagedUserStatus } from "../../../hooks/useAdminUser";
import { AdminUserService } from "../../../services/AdminUserService";

export function UserManagementPage() {
	const [keyword, setKeyword] = useState("");
	const [role, setRole] = useState<string | null>(null);
	const [status, setStatus] = useState<string | null>(null);

	const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
	const [banningUser, setBanningUser] = useState<ManagedUser | null>(null);

	const [editOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);
	const [banOpened, { open: openBan, close: closeBan }] =
		useDisclosure(false);

	const { mutate: banUser, isPending: isBanning } = useBanManagedUser();
	const { mutate: unbanUser } = useUnbanManagedUser();
	const { mutate: updateRole } = useUpdateManagedUserRole();
	const { mutate: updateStatus } = useUpdateManagedUserStatus();

	const handleOpenEdit = (user: ManagedUser) => {
		setEditingUser(user);
		openEdit();
	};

	const handleOpenBan = (user: ManagedUser) => {
		setBanningUser(user);
		openBan();
	};

	const handleCloseEdit = () => {
		setEditingUser(null);
		closeEdit();
	};

	const handleCloseBan = () => {
		setBanningUser(null);
		closeBan();
	};

	const columns = useMemo(
		() =>
			getColumns({
				onEdit: handleOpenEdit,
				onBan: handleOpenBan,
				onUnban: (user) => unbanUser(user._id),
				onChangeRole: (user, nextRole) =>
					updateRole({ id: user._id, role: nextRole }),
				onChangeStatus: (user, nextStatus) =>
					updateStatus({ id: user._id, status: nextStatus }),
			}),
		[],
	);

	const dataTable = useDataTable<ManagedUser>({
		columns,
		service: async () => {
			const res = await AdminUserService.getAll({
				page: 1,
				limit: 20,
				keyword: keyword || undefined,
				role: (role as "admin" | "author" | "user") || undefined,
				status: (status as "active" | "inactive" | "banned") || undefined,
			});

			return res.items;
		},
		queryKey: ["managed-users", keyword, role, status],
	});

	return (
		<div className="space-y-4">
			<Group justify="space-between" align="center">
				<Title order={2}>Quản lý người dùng</Title>
			</Group>

			<DataTable dataTable={dataTable}>
				<div className="flex items-center justify-between gap-4">
					{/* <Group>
						<TextInput
							placeholder="Tìm username, email, họ tên..."
							leftSection={<IconSearch size={16} />}
							value={keyword}
							onChange={(e) => setKeyword(e.currentTarget.value)}
						/>
						<Select
							placeholder="Lọc vai trò"
							data={[
								{ value: "admin", label: "Quản trị viên" },
								{ value: "author", label: "Tác giả" },
								{ value: "user", label: "Người dùng" },
							]}
							value={role}
							onChange={setRole}
							clearable
						/>
						<Select
							placeholder="Lọc trạng thái"
							data={[
								{ value: "active", label: "Hoạt động" },
								{ value: "inactive", label: "Không hoạt động" },
								{ value: "banned", label: "Bị khóa" },
							]}
							value={status}
							onChange={setStatus}
							clearable
						/>
					</Group> */}

					<DataTableColumns />
				</div>

				<DataTableContent />
				<DataTablePagination />
			</DataTable>

			<EditUserModal
				opened={editOpened}
				onClose={handleCloseEdit}
				user={editingUser}
			/>

			<BanUserModal
				opened={banOpened}
				onClose={handleCloseBan}
				userName={banningUser?.fullName}
				loading={isBanning}
				onConfirm={(reason) => {
					if (!banningUser) return;
					banUser(
						{ id: banningUser._id, banReason: reason },
						{
							onSuccess: () => {
								handleCloseBan();
							},
						},
					);
				}}
			/>
		</div>
	);
}

function getColumns({
	onEdit,
	onBan,
	onUnban,
	onChangeRole,
	onChangeStatus,
}: {
	onEdit: (user: ManagedUser) => void;
	onBan: (user: ManagedUser) => void;
	onUnban: (user: ManagedUser) => void;
	onChangeRole: (
		user: ManagedUser,
		role: "admin" | "author" | "user",
	) => void;
	onChangeStatus: (
		user: ManagedUser,
		status: "active" | "inactive",
	) => void;
}): ColumnDef<ManagedUser>[] {
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
			accessorKey: "fullName",
			header: "Họ tên",
		},
		{
			accessorKey: "email",
			header: "Email",
		},
		{
			accessorKey: "auth.provider",
			header: "Provider",
			cell: ({ row }) => row.original.auth?.provider || "local",
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
			accessorKey: "auth.lastLoginAt",
			header: "Đăng nhập gần nhất",
			cell: ({ row }) =>
				row.original.auth?.lastLoginAt
					? format.date(new Date(row.original.auth.lastLoginAt))
					: "-",
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
			id: "actions",
			header: "Hành động",
			cell: ({ row }) => {
				const user = row.original;

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
								onClick={() => onEdit(user)}
							>
								Chỉnh sửa
							</Menu.Item>

							<Menu.Label>Đổi vai trò</Menu.Label>
							<Menu.Item onClick={() => onChangeRole(user, "user")}>
								Đặt là Người dùng
							</Menu.Item>
							<Menu.Item onClick={() => onChangeRole(user, "author")}>
								Đặt là Tác giả
							</Menu.Item>
							<Menu.Item onClick={() => onChangeRole(user, "admin")}>
								Đặt là Quản trị viên
							</Menu.Item>

							<Menu.Label>Đổi trạng thái</Menu.Label>
							<Menu.Item onClick={() => onChangeStatus(user, "active")}>
								Đặt hoạt động
							</Menu.Item>
							<Menu.Item onClick={() => onChangeStatus(user, "inactive")}>
								Đặt không hoạt động
							</Menu.Item>

							{user.status !== "banned" ? (
								<Menu.Item
									color="red"
									leftSection={<IconBan size={16} />}
									onClick={() => onBan(user)}
								>
									Khóa tài khoản
								</Menu.Item>
							) : (
								<Menu.Item
									color="green"
									leftSection={<IconCheck size={16} />}
									onClick={() => onUnban(user)}
								>
									Mở khóa tài khoản
								</Menu.Item>
							)}
						</Menu.Dropdown>
					</Menu>
				);
			},
		},
	];
}