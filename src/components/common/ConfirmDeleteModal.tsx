import { Button, Modal, Text } from "@mantine/core";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  loading = false,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.",
  confirmText = "Xóa",
  cancelText = "Hủy",
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={!loading}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      radius="lg"
      size="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
        </div>
      }
    >
      <div className="pt-2">
        <Text size="sm" c="dimmed" className="leading-6">
          {message}
        </Text>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="default"
            radius="md"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button color="red" radius="md" loading={loading} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}