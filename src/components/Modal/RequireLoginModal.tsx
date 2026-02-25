import type { FC } from "react";
import { Modal, Text, Button, Stack, Group, ThemeIcon } from "@mantine/core";
import { UserLock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RequireLoginModalProps {
  opened: boolean;
  onClose: () => void;
}

const RequireLoginModal: FC<RequireLoginModalProps> = ({
  opened,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      radius="md"
      padding="lg"
    >
      <Stack align="center" gap="sm">
        <ThemeIcon size={56} radius="xl" color="blue" variant="light">
          <UserLock size={28} />
        </ThemeIcon>

        <Text fw={700} size="lg">
          Cần đăng nhập
        </Text>

        <Text size="sm" c="dimmed" ta="center">
          Bạn cần đăng nhập để thực hiện tính năng này.
        </Text>

        <Group mt="md" w="100%">
          <Button
            variant="default"
            fullWidth
            onClick={onClose}
          >
            Để sau
          </Button>

          <Button
            color="blue"
            fullWidth
            onClick={handleLogin}
          >
            Đăng nhập ngay
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RequireLoginModal;
