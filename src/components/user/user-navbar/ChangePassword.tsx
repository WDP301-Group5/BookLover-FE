import { Button, PasswordInput, Stack, Text, Group } from "@mantine/core";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../../services/UserService";
import { showError, showSuccess } from "../../../utils/notifications";

interface ChangePasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FieldErrors {
  [key: string]: string;
}

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ChangePasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (form.currentPassword === form.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác với mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof ChangePasswordFormState,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await UserService.changePassword(
        form.currentPassword,
        form.newPassword,
        form.confirmPassword,
      );

      showSuccess("Mật khẩu đã được thay đổi thành công!");

      // Reset form
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      let errorMessage = "Có lỗi xảy ra khi thay đổi mật khẩu";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as { message: string }).message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Lock size={24} />
        <Text size="lg" fw={600}>
          Thay đổi mật khẩu
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <div>
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500}>
                Mật khẩu hiện tại <span style={{ color: "red" }}>*</span>
              </Text>
              <Text
                size="sm"
                c="blue"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
                className="hover:underline"
              >
                Quên mật khẩu?
              </Text>
            </Group>
            <PasswordInput
              placeholder="Nhập mật khẩu hiện tại"
              value={form.currentPassword}
              onChange={(e) =>
                handleChange("currentPassword", e.currentTarget.value)
              }
              error={errors.currentPassword}
              disabled={loading}
            />
          </div>

          <PasswordInput
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            required
            value={form.newPassword}
            disabled={loading}
            onChange={(e) => {
              handleChange("newPassword", e.currentTarget.value);
            }}
            error={errors.newPassword}
          />

          <PasswordInput
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.currentTarget.value)
            }
            error={errors.confirmPassword}
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            fullWidth
            mt="md"
          >
            Thay đổi mật khẩu
          </Button>
        </Stack>
      </form>

      <Text size="sm" c="dimmed" mt="lg">
        Mẹo: Sử dụng mật khẩu mạnh với kết hợp chữ hoa, chữ thường, số và ký tự
        đặc biệt.
      </Text>
    </div>
  );
};

export default ChangePassword;
