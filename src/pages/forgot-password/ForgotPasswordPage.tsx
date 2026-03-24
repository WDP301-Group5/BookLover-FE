import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./ForgotPassword.module.css";
import { useForm } from "@mantine/form";
import z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { showSuccess, showError, showWarning } from "../../utils/notifications";
import UserService from "../../services/UserService";
import { useUserStore } from "../../stores/useUserStore";

const forgotPasswordSchema = z.object({
  email: z.email("Định dạng email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type Status = "idle" | "loading" | "waiting" | "error";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore();
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validate: zod4Resolver(forgotPasswordSchema),
  });

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await UserService.requestPasswordReset(values.email);

      setEmail(values.email);
      setStatus("waiting");

      // Set cooldown from response
      if (response.nextResendIn) {
        setResendCooldown(response.nextResendIn);
      }

      showSuccess(
        response.message ||
          "Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
        "Thành công",
      );
    } catch (err: unknown) {
      let errorMsg = "Yêu cầu thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMsg = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }

      setErrorMessage(errorMsg);
      setStatus("error");

      showError(errorMsg, "Lỗi");
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      showWarning("Vui lòng nhập địa chỉ email.", "Lỗi");
      return;
    }

    setResendLoading(true);
    try {
      const response = await UserService.requestPasswordReset(email);

      // Set cooldown timer from response
      if (response.nextResendIn) {
        setResendCooldown(response.nextResendIn);
      }

      showSuccess(
        response.message ||
          "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.",
        "Thành công",
      );
    } catch (err: unknown) {
      let errorMsg = "Gửi lại thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMsg = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }

      showError(errorMsg, "Lỗi");
    } finally {
      setResendLoading(false);
    }
  };

  // Render idle state (form)
  if (status === "idle" || status === "loading" || status === "error") {
    return (
      <Container size={"xs"} my={"xl"}>
        <Title className={classes.title} ta="center">
          Quên mật khẩu?
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </Text>

        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email của bạn"
              placeholder="abc@xyz.com"
              required
              disabled={status === "loading"}
              {...form.getInputProps("email")}
            />

            {status === "error" && errorMessage && (
              <Text color="red" size="sm" mt="sm">
                {errorMessage}
              </Text>
            )}

            <Group justify="space-between" mt="lg" className={classes.controls}>
              {isLoggedIn ? (
                <Button
                  variant="subtle"
                  onClick={() => navigate(-1)}
                  className={classes.control}
                >
                  Hủy bỏ
                </Button>
              ) : (
                <Anchor c="dimmed" size="sm" className={classes.control}>
                  <Center inline>
                    <IconArrowLeft size={12} stroke={1.5} />
                    <Box ml={5} onClick={() => navigate("/login")}>
                      Quay lại trang đăng nhập
                    </Box>
                  </Center>
                </Anchor>
              )}
              <Button
                className={classes.control}
                loading={status === "loading"}
                type="submit"
              >
                Đặt lại mật khẩu
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    );
  }

  // Render waiting state
  return (
    <Container size={"xs"} my={"xl"}>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <Stack align="center">
          <ThemeIcon size={64} radius="md" variant="light" color="blue">
            <IconMail size={32} />
          </ThemeIcon>

          <Title order={2} ta="center">
            Chờ xác thực
          </Title>

          <Text ta="center" c="dimmed" size="sm">
            Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết để đặt
            lại mật khẩu. Liên kết này sẽ có hiệu lực trong 15 phút.
          </Text>

          <Text ta="center" size="sm" fw={500}>
            Không nhận được email?
          </Text>

          <Group>
            <Button
              variant="subtle"
              disabled={resendCooldown > 0}
              loading={resendLoading}
              onClick={handleResendEmail}
            >
              {resendCooldown > 0
                ? `Gửi lại trong ${resendCooldown}s`
                : "Gửi lại"}
            </Button>
          </Group>

          {isLoggedIn ? (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate(-1)}
              mt="lg"
            >
              Hủy bỏ
            </Button>
          ) : (
            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/login")}
              mt="lg"
            >
              Quay lại đăng nhập
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
