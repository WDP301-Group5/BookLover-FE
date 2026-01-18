import { notifications } from "@mantine/notifications";

export const showSuccess = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Thành công!",
    message,
    color: "green",
    radius: "md",
    withBorder: true,
    icon: null,
  });
};

export const showError = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Có lỗi xảy ra!",
    message,
    color: "red",
    radius: "md",
    withBorder: true,
  });
};

export const showWarning = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Cảnh báo!",
    message,
    color: "yellow",
    radius: "md",
    withBorder: true,
  });
};
