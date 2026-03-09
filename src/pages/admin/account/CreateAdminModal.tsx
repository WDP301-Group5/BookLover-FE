import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormSelect } from "../../../components/form/form-select";
import { useCreateAdmin } from "../../../hooks/useAdmin";

// Validation schema
const createAdminSchema = z
	.object({
		email: z.email("Email không hợp lệ"),
		password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
		confirmPassword: z.string(),
		username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
		fullName: z.string().min(1, "Họ tên không được để trống"),
		nickName: z.string().optional().or(z.literal("")),
		penName: z.string().optional().or(z.literal("")),
		dob: z.string().optional().or(z.null()),
		role: z.literal("admin"),
		status: z.literal("active"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu xác nhận không khớp",
		path: ["confirmPassword"],
	});

type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

interface CreateAdminModalProps {
	opened: boolean;
	onClose: () => void;
}

export function CreateAdminModal({ opened, onClose }: CreateAdminModalProps) {
	const { mutate: createAdmin, isPending } = useCreateAdmin();

	const form = useForm<CreateAdminFormValues>({
		resolver: zodResolver(createAdminSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			username: "",
			fullName: "",
			nickName: "",
			penName: "",
			dob: null,
			role: "admin",
			status: "active",
		},
	});

	const handleSubmit = form.handleSubmit((values) => {
		console.log(values);

		const payload = {
			...values,
			dob: values.dob || undefined,
			nickName: values.nickName || undefined,
			penName: values.penName || undefined,
		};

		createAdmin(payload, {
			onSuccess: () => {
				form.reset();
				onClose();
			},
		});
	});

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title="Tạo quản trị viên mới"
			size="lg"
			closeOnClickOutside={false}
		>
			<form onSubmit={handleSubmit}>
				<Stack gap="md">
					<TextInput
						label="Email *"
						placeholder="nhap@email.com"
						{...form.register("email")}
						error={form.formState.errors.email?.message}
						required
					/>

					<TextInput
						label="Username *"
						placeholder="username"
						{...form.register("username")}
						error={form.formState.errors.username?.message}
						required
					/>

					<TextInput
						label="Họ tên *"
						placeholder="Nguyễn Văn A"
						{...form.register("fullName")}
						error={form.formState.errors.fullName?.message}
						required
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

					<TextInput
						label="Mật khẩu *"
						type="password"
						placeholder="Nhập mật khẩu"
						{...form.register("password")}
						error={form.formState.errors.password?.message}
						required
					/>

					<TextInput
						label="Xác nhận mật khẩu *"
						type="password"
						placeholder="Nhập lại mật khẩu"
						{...form.register("confirmPassword")}
						error={form.formState.errors.confirmPassword?.message}
						required
					/>

					<FormSelect
						control={form.control}
						name="role"
						label="Vai trò"
						options={[{ value: "admin", label: "Quản trị viên" }]}
						disabled
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
						disabled
					/>

					<Group justify="flex-end" mt="md">
						<Button variant="subtle" onClick={handleClose}>
							Hủy
						</Button>
						<Button type="submit" loading={isPending}>
							Tạo mới
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
