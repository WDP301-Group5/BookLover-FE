import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm">
      <Stack align="center" justify="center" style={{ minHeight: "60vh" }}>
        <Lock size={64} className="text-red-500" />
        <Title order={1}>Truy cập bị từ chối</Title>
        <Text size="lg" c="dimmed" ta="center">
          Bạn không có quyền truy cập vào trang này. Vai trò hiện tại của bạn
          không có cấp độ truy cập cần thiết.
        </Text>
        <Stack gap="sm" style={{ width: "100%" }}>
          <Button fullWidth onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
          <Button variant="default" fullWidth onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
