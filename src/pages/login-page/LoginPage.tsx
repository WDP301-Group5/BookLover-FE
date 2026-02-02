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
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import classes from "./LoginPage.module.css";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  GoogleLogin,
  type GoogleCredentialResponse,
} from "@react-oauth/google";
import UserService from "../../services/UserService";
import { useUserStore } from "../../stores/useUserStore";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Update user store
        setUser(response.data.user);

        // Show success notification
        notifications.show({
          title: "Success",
          message: "Login successful!",
          color: "green",
        });

        // Redirect to home page
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.message || "Login failed. Please try again.";
        setError(errorMessage);
        notifications.show({
          title: "Login Failed",
          message: errorMessage,
          color: "red",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      notifications.show({
        title: "Google Login Failed",
        message: "No credential received from Google",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const rememberMe = form.values.rememberMe || false;
      const response = await UserService.googleLogin(
        credentialResponse.credential,
        rememberMe,
      );

      if (response.success && response.data) {
        // Store tokens
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Update user store
        setUser(response.data.user);

        // Show success notification
        notifications.show({
          title: "Success",
          message: "Google login successful!",
          color: "green",
        });

        // Redirect to home page
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.message || "Google login failed. Please try again.";
        notifications.show({
          title: "Google Login Failed",
          message: errorMessage,
          color: "red",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    notifications.show({
      title: "Google Login Failed",
      message: "Failed to authenticate with Google",
      color: "red",
    });
  };

  return (
    <Container size={"xs"} my={"xl"}>
      <Title ta="center" className={classes.title}>
        Chào mừng quay trở lại!
      </Title>

      <Text className={classes.subtitle}>
        Bạn chưa có tài khoản? <Anchor>Tạo tài khoản</Anchor>
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
            <Anchor component="button" size="sm" type="button">
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
