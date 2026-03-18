import { Modal, TextInput, Button, Group, LoadingOverlay } from "@mantine/core";
import { useState } from "react";

interface BanTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transactionId: string | undefined;
  loading: boolean;
  onConfirm: (reason: string) => void;
}

export function BanTransactionModal({
  opened,
  onClose,
  transactionId,
  loading,
  onConfirm,
}: BanTransactionModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason) {
      onConfirm(reason);
    } else {
      alert("Lý do khóa tài khoản là bắt buộc!");
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Khóa giao dịch">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <div>
        <TextInput
          label="Lý do khóa"
          placeholder="Nhập lý do khóa giao dịch"
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleConfirm} disabled={loading}>
            Xác nhận khóa
          </Button>
        </Group>
      </div>
    </Modal>
  );
}