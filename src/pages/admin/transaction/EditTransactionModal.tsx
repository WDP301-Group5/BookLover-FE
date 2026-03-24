import { Modal, TextInput, Button, Group } from "@mantine/core";
import type { ManagedTransaction } from "../../../interfaces/transaction";

interface EditTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: ManagedTransaction | null;
}

export function EditTransactionModal({
  opened,
  onClose,
  transaction,
}: EditTransactionModalProps) {
  const handleSave = () => {
    // Implement save logic here (call API to save transaction)
    console.log("Transaction saved", transaction);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Chỉnh sửa giao dịch">
      {transaction ? (
        <div>
          <TextInput label="Mã giao dịch" value={transaction.transactionId} disabled />
          <TextInput label="Số tiền" value={transaction.amount} disabled />
          <TextInput label="Trạng thái" value={transaction.status} disabled />
          <Group position="right" mt="md">
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </Group>
        </div>
      ) : (
        <div>Không có thông tin giao dịch</div>
      )}
    </Modal>
  );
}