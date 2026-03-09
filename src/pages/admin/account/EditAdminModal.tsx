import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Checkbox,
	Group,
	Modal,
	Stack,
	TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormSelect } from "../../../components/form/form-select";
import { useUpdateAdmin } from "../../../hooks/useAdmin";
import type { AdminUser } from "../../../interfaces/AdminUser";

// Validation schema
const updateAdminSchema = z
	.object({
		username: z
			.string()
			.min(3, "Username phải có ít nhất 3 ký tự")
			.optional()
			.or(z.literal("")),
		fullName: z
			.string()
			.min(1, "Họ tên không được để trống")
			.optional()
			.or(z.literal("")),
		nickName: z.string().optional().or(z.literal("")),
		penName: z.string().optional().or(z.literal("")),
		dob: z.string().optional().or(z.null()),
		role: z.enum(["admin", "author", "user"]),
		status: z.enum(["active", "inactive", "banned"]),
		changePassword: z.boolean().optional(),
		newPassword: z
			.string()
			.min(8, "Mật khẩu phải có ít nhất 8 ký tự")
			.optional()
			.or(z.literal("")),
		confirmPassword: z.string().optional().or(z.literal("")),
	})
	.refine(
		(data) => {
			if (data.changePassword) {
				return data.newPassword !== undefined && data.newPassword !== "";
			}
			return true;
		},
		{
			message: "Vui lòng nhập mật khẩu mới",
			path: ["newPassword"],
		},
	)
	.refine(
		(data) => {
			if (data.changePassword) {
				return data.newPassword === data.confirmPassword;
			}
			return true;
		},
		{
			message: "Mật khẩu xác nhận không khớp",
			path: ["confirmPassword"],
		},
	);

type UpdateAdminFormValues = z.infer<typeof updateAdminSchema>;

interface EditAdminModalProps {
	opened: boolean;
	onClose: () => void;
	user: AdminUser | null;
}

export function EditAdminModal({ opened, onClose, user }: EditAdminModalProps) {
	const { mutate: updateAdmin, isPending } = useUpdateAdmin();

	const form = useForm<UpdateAdminFormValues>({
		resolver: zodResolver(updateAdminSchema),
		defaultValues: {
			username: "",
			fullName: "",
			nickName: "",
			penName: "",
			dob: null,
			role: "admin",
			status: "active",
			changePassword: false,
			newPassword: "",
			confirmPassword: "",
		},
	});

	// Populate form when user changes
	useEffect(() => {
		if (user) {
			form.reset({
				username: user.username || "",
				fullName: user.fullName || "",
				nickName: user.nickName || "",
				penName: user.penName || "",
				dob: user.dob || null,
				role: user.role,
				status: user.status,
				changePassword: false,
				newPassword: "",
				confirmPassword: "",
			});
		}
	}, [form, user]);

	const handleSubmit = form.handleSubmit((values) => {
		if (!user) return;

		const payload: Record<string, unknown> = {
			username: values.username || undefined,
			fullName: values.fullName || undefined,
			nickName: values.nickName || undefined,
			penName: values.penName || undefined,
			dob: values.dob || undefined,
			role: values.role,
			status: values.status,
		};

		if (values.changePassword && values.newPassword) {
			payload.changePassword = true;
			payload.newPassword = values.newPassword;
			payload.confirmPassword = values.confirmPassword;
		}

		updateAdmin(
			{ id: user._id, data: payload },
			{
				onSuccess: () => {
					form.reset();
					onClose();
				},
			},
		);
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	const watchChangePassword = form.watch("changePassword");

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title="Chỉnh sửa quản trị viên"
			size="lg"
			closeOnClickOutside={false}
		>
			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<TextInput
						label="Email"
						value={user?.email || ""}
						disabled
						readOnly
					/>

					<TextInput
						label="Username *"
						placeholder="username"
						{...form.register("username")}
						error={form.formState.errors.username?.message}
					/>

					<TextInput
						label="Họ tên *"
						placeholder="Nguyễn Văn A"
						{...form.register("fullName")}
						error={form.formState.errors.fullName?.message}
					/>

					<TextInput
						label="Biệt danh"
						placeholder="Biệt danh hiển thị"
						{...form.register("nickName")}
						error={form.formState.errors.nickName?.message}
					/>

					<TextInput
						label="Bút danh"
						placeholder="Bút danh tác giả"
						{...form.register("penName")}
						error={form.formState.errors.penName?.message}
					/>

					<DatePickerInput
						label="Ngày sinh"
						placeholder="Chọn ngày sinh"
						valueFormat="DD/MM/YYYY"
						value={form.watch("dob") ? new Date(form.watch("dob")!) : null}
						onChange={(date) => {
							form.setValue("dob", date ? date.toISOString() : null);
						}}
						clearable
					/>

					<FormSelect
						control={form.control}
						name="role"
						label="Vai trò"
						options={[
							{ value: "admin", label: "Quản trị viên" },
							{ value: "author", label: "Tác giả" },
							{ value: "user", label: "Người dùng" },
						]}
					/>

					<FormSelect
						control={form.control}
						name="status"
						label="Trạng thái"
						options={[
							{ value: "active", label: "Hoạt động" },
							{ value: "inactive", label: "Không hoạt động" },
							{ value: "banned", label: "Bị khóa" },
						]}
					/>

					<Checkbox label="Đổi mật khẩu" {...form.register("changePassword")} />

					{watchChangePassword && (
						<>
							<TextInput
								label="Mật khẩu mới *"
								type="password"
								placeholder="Nhập mật khẩu mới"
								{...form.register("newPassword")}
								error={form.formState.errors.newPassword?.message}
							/>

							<TextInput
								label="Xác nhận mật khẩu *"
								type="password"
								placeholder="Nhập lại mật khẩu mới"
								{...form.register("confirmPassword")}
								error={form.formState.errors.confirmPassword?.message}
							/>
						</>
					)}

					<Group justify="flex-end" mt="md">
						<Button variant="subtle" onClick={handleClose}>
							Hủy
						</Button>
						<Button type="submit" loading={isPending}>
							Cập nhật
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
