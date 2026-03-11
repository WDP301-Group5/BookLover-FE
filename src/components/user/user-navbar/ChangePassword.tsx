import { Button, PasswordInput, Stack, Text } from "@mantine/core";
import { Lock } from "lucide-react";
import { useState } from "react";
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Có lỗi xảy ra khi thay đổi mật khẩu";

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
          <PasswordInput
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại"
            required
            value={form.currentPassword}
            onChange={(e) =>
              handleChange("currentPassword", e.currentTarget.value)
            }
            error={errors.currentPassword}
            disabled={loading}
          />

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
