import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showSuccess, showError } from "../../utils/notifications";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import classes from "./RegisterPage.module.css";
import UserService from "../../services/UserService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },

    validate: {
      name: (val) => (val.trim().length < 1 ? "Tên không được để trống" : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Email không hợp lệ"),
      password: (val) =>
        val.length < 8 ? "Mật khẩu phải có ít nhất 8 ký tự" : null,
      confirmPassword: (val, values) =>
        val !== values.password ? "Mật khẩu xác nhận không khớp" : null,
      terms: (val) => (!val ? "Bạn phải chấp nhận điều khoản sử dụng" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const response = await UserService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.success) {
        showSuccess(
          response.message || "Vui lòng kiểm tra email để xác thực tài khoản.",
          "Đăng ký thành công!",
        );

        navigate("/verify-email", { replace: true });
      }
    } catch (err: unknown) {
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = (err as { message: string }).message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      showError(errorMessage, "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={"xs"} my={"xl"}>
      <Title ta="center" className={classes.title}>
        Đăng ký tài khoản!
      </Title>

      <Text className={classes.subtitle}>
        Bạn đã có tài khoản?{" "}
        <Anchor onClick={() => navigate("/login")}>Hãy đăng nhập</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              required
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
              error={form.errors.name}
              radius="md"
            />

            <TextInput
              required
              label="Email"
              placeholder="hello@example.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={form.errors.password}
              visible={showPassword}
              onVisibilityChange={setShowPassword}
              radius="md"
            />

            <PasswordInput
              required
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue("confirmPassword", event.currentTarget.value)
              }
              error={form.errors.confirmPassword}
              visible={showPassword}
              onVisibilityChange={setShowPassword}
              radius="md"
            />

            <Checkbox
              label="Tôi chấp nhận điều khoản sử dụng"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
              error={form.errors.terms}
            />
          </Stack>

          <Button fullWidth mt="xl" radius="md" type="submit" loading={loading}>
            Đăng ký
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
