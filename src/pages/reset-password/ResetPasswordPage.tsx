import { IconArrowLeft, IconCheck, IconX, IconMail } from "@tabler/icons-react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./ResetPasswordPage.module.css";
import { useForm } from "@mantine/form";
import z from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { showSuccess, showError } from "../../utils/notifications";
import UserService from "../../services/UserService";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z
      .string()
      .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const requestNewLinkSchema = z.object({
  email: z.email("Định dạng email không hợp lệ"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type RequestNewLinkValues = z.infer<typeof requestNewLinkSchema>;

type Status = "loading" | "waiting" | "success" | "error" | "token-expired";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  const [formLoading, setFormLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(resetPasswordSchema),
  });

  const requestNewLinkForm = useForm<RequestNewLinkValues>({
    initialValues: {
      email: "",
    },
    validate: zod4Resolver(requestNewLinkSchema),
  });

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Link không hợp lệ. Vui lòng yêu cầu link mới.");
      return;
    }

    // Token validation - we'll do simple check, actual validation happens on confirm
    // For now just set to waiting since we can't validate without calling backend
    setStatus("waiting");
  }, [token]);

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      showError("Link không hợp lệ", "Lỗi");
      return;
    }

    setFormLoading(true);

    try {
      const response = await UserService.confirmPasswordReset(
        token,
        values.newPassword,
        values.confirmPassword,
      );

      setStatus("success");
      setSuccessMessage(response.message);

      showSuccess(
        response.message || "Mật khẩu đã được đặt lại thành công!",
        "Thành công",
      );
    } catch (err: unknown) {
      let errorMsg = "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMsg = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }

      // Check if error is token-expired
      if (
        errorMsg.toLowerCase().includes("hết hạn") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        setStatus("token-expired");
        setErrorMessage(errorMsg);
      } else {
        setStatus("error");
        setErrorMessage(errorMsg);
      }

      showError(errorMsg, "Lỗi");
    } finally {
      setFormLoading(false);
    }
  };

  const handleResendLink = async (values: RequestNewLinkValues) => {
    setResendLoading(true);
    try {
      const response = await UserService.requestPasswordReset(values.email);

      // Set cooldown from response
      if (response.nextResendIn) {
        setResendCooldown(response.nextResendIn);
      }

      showSuccess(
        response.message || "Nếu email tồn tại, bạn sẽ nhận được liên kết mới.",
        "Thành công",
      );

      // Clear form
      requestNewLinkForm.reset();
    } catch (err: unknown) {
      let errorMsg = "Gửi lại thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMsg = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }

      notifications.show({
        title: "Lỗi",
        message: errorMsg,
        color: "red",
        autoClose: 3000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Render loading state
  if (status === "loading") {
    return (
      <Container size={"xs"} my={"xl"}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Stack align="center">
            <Loader />
            <Text c="dimmed" ta="center">
              Đang xác thực liên kết...
            </Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Render error state (invalid token)
  if (status === "error") {
    return (
      <Container size={"xs"} my={"xl"}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Stack align="center">
            <ThemeIcon size={64} radius="md" variant="light" color="red">
              <IconX size={32} />
            </ThemeIcon>

            <Title order={2} ta="center">
              Đặt lại mật khẩu thất bại
            </Title>

            <Text ta="center" c="dimmed" size="sm">
              {errorMessage || "Link không hợp lệ. Vui lòng yêu cầu link mới."}
            </Text>

            <Button
              fullWidth
              onClick={() => navigate("/forgot-password")}
              mt="lg"
            >
              Yêu cầu link mới
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Render token-expired state (with resend form)
  if (status === "token-expired") {
    return (
      <Container size={"xs"} my={"xl"}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Stack align="center">
            <ThemeIcon size={64} radius="md" variant="light" color="orange">
              <IconMail size={32} />
            </ThemeIcon>

            <Title order={2} ta="center">
              Liên kết đã hết hạn
            </Title>

            <Text ta="center" c="dimmed" size="sm">
              Liên kết đặt lại mật khẩu của bạn đã hết hạn. Vui lòng nhập email
              để nhận liên kết mới.
            </Text>

            <form
              onSubmit={requestNewLinkForm.onSubmit(handleResendLink)}
              style={{ width: "100%" }}
            >
              <Stack>
                <TextInput
                  label="Email của bạn"
                  placeholder="abc@xyz.com"
                  disabled={resendLoading}
                  {...requestNewLinkForm.getInputProps("email")}
                />
                <Button
                  fullWidth
                  type="submit"
                  loading={resendLoading}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Gửi lại trong ${resendCooldown}s`
                    : "Gửi lại liên kết"}
                </Button>
              </Stack>
            </form>

            <Anchor
              c="dimmed"
              size="sm"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer" }}
            >
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Quay lại trang yêu cầu</Box>
              </Center>
            </Anchor>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Render success state
  if (status === "success") {
    return (
      <Container size={"xs"} my={"xl"}>
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <Stack align="center">
            <ThemeIcon size={64} radius="md" variant="light" color="teal">
              <IconCheck size={32} />
            </ThemeIcon>

            <Title order={2} ta="center">
              Đặt lại mật khẩu thành công!
            </Title>

            <Text ta="center" c="dimmed" size="sm">
              {successMessage ||
                "Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập bằng mật khẩu mới."}
            </Text>

            <Button
              fullWidth
              onClick={() => navigate("/login", { replace: true })}
              mt="lg"
            >
              Đăng nhập ngay
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Render form state (waiting)
  return (
    <Container size={"xs"} my={"xl"}>
      <Title className={classes.title} ta="center">
        Đặt lại mật khẩu
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Nhập mật khẩu mới cho tài khoản của bạn
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PasswordInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              visible={visible}
              onVisibilityChange={toggle}
              disabled={formLoading}
              {...form.getInputProps("newPassword")}
            />
            <PasswordInput
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              visible={visible}
              onVisibilityChange={toggle}
              disabled={formLoading}
              {...form.getInputProps("confirmPassword")}
            />
          </Stack>
          <Button
            fullWidth
            mt="xl"
            radius="md"
            type="submit"
            loading={formLoading}
          >
            Đặt lại mật khẩu
          </Button>

          <Group justify="center" mt="lg">
            <Anchor
              c="dimmed"
              size="sm"
              onClick={() => navigate("/forgot-password")}
            >
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Quay lại yêu cầu link mới</Box>
              </Center>
            </Anchor>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
