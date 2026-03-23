import { Modal, TextInput, Group, Button, Stack } from "@mantine/core";
import { useState, useEffect } from "react";

interface Props {
  opened: boolean;
  onClose: () => void;
  currentName: string;
  onSubmit: (newName: string) => Promise<void>;
  isLoading: boolean;
}

export const EditListNameModal = ({
  opened,
  onClose,
  currentName,
  onSubmit,
  isLoading,
}: Props) => {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setName(currentName);
    setError("");
  }, [opened, currentName]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Tên danh sách không được để trống");
      return;
    }

    if (trimmedName === currentName) {
      onClose();
      return;
    }

    try {
      await onSubmit(trimmedName);
      onClose();
    } catch (err) {
      setError("Không thể cập nhật danh sách");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chỉnh sửa tên danh sách"
      centered
    >
      <Stack gap="md">
        <TextInput
          label="Tên danh sách"
          placeholder="Nhập tên danh sách"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
            setError("");
          }}
          error={error}
          disabled={isLoading}
          autoFocus
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} loading={isLoading}>
            Lưu
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
