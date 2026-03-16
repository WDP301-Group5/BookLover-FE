import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useState } from "react";

interface BanUserModalProps {
	opened: boolean;
	onClose: () => void;
	onConfirm: (reason: string) => void;
	userName?: string;
	loading?: boolean;
}

export function BanUserModal({
	opened,
	onClose,
	onConfirm,
	userName,
	loading,
}: BanUserModalProps) {
	const [reason, setReason] = useState("");

	const handleClose = () => {
		setReason("");
		onClose();
	};

	const handleSubmit = () => {
		if (!reason.trim()) return;
		onConfirm(reason.trim());
		setReason("");
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title={`Khóa người dùng${userName ? ` - ${userName}` : ""}`}
			centered
		>
			<div className="space-y-4">
				<TextInput
					label="Lý do khóa"
					placeholder="Nhập lý do khóa tài khoản"
					value={reason}
					onChange={(e) => setReason(e.currentTarget.value)}
				/>

				<Group justify="flex-end">
					<Button variant="default" onClick={handleClose}>
						Hủy
					</Button>
					<Button color="red" onClick={handleSubmit} loading={loading}>
						Xác nhận khóa
					</Button>
				</Group>
			</div>
		</Modal>
	);
}