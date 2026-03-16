import {
	Button,
	Group,
	Modal,
	NumberInput,
	TextInput,
	Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import type { ManagedUser } from "../../../interfaces/UserManagement";
import { useAdminUser } from "../../../hooks/useAdminUser";

interface EditUserModalProps {
	opened: boolean;
	onClose: () => void;
	user: ManagedUser | null;
}

export function EditUserModal({
	opened,
	onClose,
	user,
}: EditUserModalProps) {
	const { mutate, isPending } = useAdminUser();

	const form = useForm({
		initialValues: {
			fullName: "",
			nickName: "",
			penName: "",
			email: "",
			dob: "",
			bio: "",
			avatarURL: "",
			backgroundURL: "",
			vipLevel: 0,
		},
		validate: {
			fullName: (value) => (!value.trim() ? "Họ tên là bắt buộc" : null),
			email: (value) => (!value.trim() ? "Email là bắt buộc" : null),
		},
	});

	useEffect(() => {
		if (user) {
			form.setValues({
				fullName: user.fullName || "",
				nickName: user.nickName || "",
				penName: user.penName || "",
				email: user.email || "",
				dob: user.dob ? String(user.dob).slice(0, 10) : "",
				bio: user.bio || "",
				avatarURL: user.avatarURL || "",
				backgroundURL: user.backgroundURL || "",
				vipLevel: user.vipLevel || 0,
			});
		}
	}, [user]);

	const handleSubmit = form.onSubmit((values) => {
		if (!user) return;

		mutate(
			{
				id: user._id,
				data: {
					fullName: values.fullName,
					nickName: values.nickName || undefined,
					penName: values.penName || undefined,
					email: values.email,
					dob: values.dob || null,
					bio: values.bio || undefined,
					avatarURL: values.avatarURL || undefined,
					backgroundURL: values.backgroundURL || undefined,
					vipLevel: values.vipLevel || 0,
				},
			},
			{
				onSuccess: () => {
					onClose();
				},
			},
		);
	});

	return (
		<Modal opened={opened} onClose={onClose} title="Chỉnh sửa người dùng" centered>
			<form onSubmit={handleSubmit} className="space-y-3">
				<TextInput label="Username" value={user?.username || ""} readOnly />
				<TextInput label="Họ tên" {...form.getInputProps("fullName")} />
				<TextInput label="Nickname" {...form.getInputProps("nickName")} />
				<TextInput label="Pen name" {...form.getInputProps("penName")} />
				<TextInput label="Email" {...form.getInputProps("email")} readOnly />
				<TextInput
					label="Ngày sinh"
					type="date"
					{...form.getInputProps("dob")}
				/>
				<Textarea label="Bio" minRows={3} {...form.getInputProps("bio")} />
				<TextInput label="Avatar URL" {...form.getInputProps("avatarURL")} />
				<TextInput
					label="Background URL"
					{...form.getInputProps("backgroundURL")}
				/>
				<NumberInput label="VIP level" min={0} {...form.getInputProps("vipLevel")} readOnly/>

				<TextInput
					label="Provider"
					value={user?.auth?.provider || "local"}
					readOnly
				/>
				<TextInput
					label="Đăng nhập gần nhất"
					value={user?.auth?.lastLoginAt || ""}
					readOnly
				/>

				<Group justify="flex-end" mt="md">
					<Button variant="default" onClick={onClose}>
						Hủy
					</Button>
					<Button type="submit" loading={isPending}>
						Lưu
					</Button>
				</Group>
			</form>
		</Modal>
	);
}