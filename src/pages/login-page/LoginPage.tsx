import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showSuccess, showError } from "../../utils/notifications";
import {
  type GoogleCredentialResponse,
  GoogleLogin,
} from "@react-oauth/google";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import UserService from "../../services/UserService";
import { useUserStore } from "../../stores/useUserStore";
import classes from "./LoginPage.module.css";

const loginSchema = z.object({
  email: z.email("Định dạng email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: zod4Resolver(loginSchema),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.login(values);

      if (response.success && response.accessToken) {
        // Store token
        localStorage.setItem("token", response.accessToken);

        // Update user store
        setUser({
          ...(response.user as any),
          spiritStones: (response.user as any)?.spiritStones ?? 0,
        });

        // Show success notification
        showSuccess(
          `Chào mừng trở lại, ${response.user.fullName}!`,
          "Đăng nhập thành công",
        );

        // Redirect based on user role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (response.user.role === "author") {
          navigate("/", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err: unknown) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
      showError(errorMessage, "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    console.log("Google Token:", credentialResponse.credential);
    if (!credentialResponse.credential) {
      showError(
        "Không nhận được thông tin từ Google",
        "Đăng nhập Google thất bại",
      );
      return;
    }

    setLoading(true);
    try {
      const rememberMe = form.values.rememberMe || false;
      const response = await UserService.googleLogin(
        credentialResponse.credential,
        rememberMe,
      );

      if (response.success && response.accessToken) {
        // Store token
        localStorage.setItem("token", response.accessToken);

        // Update user store
        setUser({
          ...(response.user as any),
          spiritStones: (response.user as any)?.spiritStones ?? 0,
        });

        // Show success notification
        showSuccess(
          `Chào mừng trở lại, ${response.user.fullName}!`,
          "Đăng nhập thành công",
        );

        // Redirect based on user role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (response.user.role === "author") {
          navigate("/author", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err: unknown) {
      let errorMessage = "Đăng nhập Google thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      showError(errorMessage, "Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showError(
      "Không thể xác thực với Google. Vui lòng thử lại.",
      "Đăng nhập Google thất bại",
    );
  };

  return (
    <Container size={"xs"} my={"xl"}>
      <Title ta="center" className={classes.title}>
        Chào mừng quay trở lại!
      </Title>

      <Text className={classes.subtitle}>
        Bạn chưa có tài khoản?{" "}
        <Anchor onClick={() => navigate("/register")}>Tạo tài khoản</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            radius="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            required
            mt="md"
            radius="md"
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label="Ghi nhớ tôi"
              {...form.getInputProps("rememberMe", { type: "checkbox" })}
            />
            <Anchor
              component="button"
              size="sm"
              type="button"
              onClick={() => navigate("/forgot-password")}
            >
              Quên mật khẩu?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" radius="md" type="submit" loading={loading}>
            Đăng nhập
          </Button>
        </form>

        <Divider
          label="Hoặc tiếp tục với Google"
          labelPosition="center"
          my="lg"
          styles={{
            label: { color: "var(--mantine-color-bright)", opacity: 0.85 },
          }}
        />
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </Paper>
    </Container>
  );
}
