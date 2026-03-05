import {
  Button,
  Container,
  Paper,
  Text,
  Title,
  Center,
  Loader,
  Stack,
  ThemeIcon,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import UserService from "../../services/UserService";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "waiting"
  >("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer effect - decrement every second
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("waiting");
        setMessage(
          "Vui lòng kiểm tra email của bạn và nhấp vào liên kết xác thực. Liên kết này sẽ có hiệu lực trong 24 giờ.",
        );
        return;
      }

      try {
        const response = await UserService.verifyEmail(token);
        setStatus("success");
        setMessage(
          response.message ||
            "Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.",
        );
      } catch (err: unknown) {
        setStatus("error");
        if (typeof err === "object" && err !== null && "message" in err) {
          setMessage((err as { message: string }).message);
        } else if (typeof err === "string") {
          setMessage(err);
        } else {
          setMessage("Xác thực email thất bại. Vui lòng thử lại.");
        }
      }
    };

    verify();
  }, [token]);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng nhập địa chỉ email.",
        color: "orange",
        autoClose: 3000,
      });
      return;
    }

    setResendLoading(true);
    try {
      const response = await UserService.resendVerificationEmail(email);

      // Set cooldown if provided
      if (response.nextResendIn) {
        setResendCooldown(response.nextResendIn);
      }

      notifications.show({
        title: "Thành công",
        message:
          response.message ||
          "Email xác thực đã được gửi. Vui lòng kiểm tra email của bạn.",
        color: "green",
        autoClose: 3000,
      });
      setEmail("");
    } catch (err: unknown) {
      let errorMessage = "Không thể gửi lại email xác thực. Vui lòng thử lại.";
      if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      notifications.show({
        title: "Lỗi",
        message: errorMessage,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container size="xs" my="xl">
      <Paper withBorder shadow="sm" p={40} mt={30} radius="md">
        {status === "loading" && (
          <Center>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text size="lg" c="dimmed">
                Đang xác thực email...
              </Text>
            </Stack>
          </Center>
        )}

        {status === "success" && (
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="green" variant="light">
              <IconCheck size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Xác thực thành công!
            </Title>
            <Text size="md" c="dimmed" ta="center">
              {message}
            </Text>
            <Button
              fullWidth
              mt="md"
              radius="md"
              onClick={() => navigate("/login", { replace: true })}
            >
              Đăng nhập ngay
            </Button>
          </Stack>
        )}

        {status === "waiting" && (
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="blue" variant="light">
              <Loader size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Chờ xác thực email
            </Title>
            <Text size="md" c="dimmed" ta="center">
              {message}
            </Text>

            <Stack w="100%" gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Gửi lại email xác thực
                </Text>
                <TextInput
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  radius="md"
                  disabled={resendLoading}
                />
                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={handleResendEmail}
                  loading={resendLoading}
                  disabled={resendCooldown > 0}
                  color="blue"
                >
                  {resendCooldown > 0
                    ? `Gửi lại trong ${resendCooldown}s`
                    : "Gửi lại email xác thực"}
                </Button>
              </div>
              <Button
                fullWidth
                radius="md"
                variant="outline"
                onClick={() => navigate("/login", { replace: true })}
              >
                Quay lại đăng nhập
              </Button>
            </Stack>
          </Stack>
        )}

        {status === "error" && (
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="red" variant="light">
              <IconX size={40} />
            </ThemeIcon>
            <Title order={2} ta="center">
              Xác thực thất bại
            </Title>
            <Text size="md" c="dimmed" ta="center">
              {message}
            </Text>

            <Stack w="100%" gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Gửi lại email xác thực
                </Text>
                <TextInput
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  radius="md"
                  disabled={resendLoading}
                />
                <Button
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={handleResendEmail}
                  loading={resendLoading}
                  disabled={resendCooldown > 0}
                  color="blue"
                >
                  {resendCooldown > 0
                    ? `Gửi lại trong ${resendCooldown}s`
                    : "Gửi lại email xác thực"}
                </Button>
              </div>
              <Button
                fullWidth
                radius="md"
                variant="outline"
                onClick={() => navigate("/register", { replace: true })}
                disabled={resendLoading || resendCooldown > 0}
              >
                Đăng ký lại
              </Button>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
