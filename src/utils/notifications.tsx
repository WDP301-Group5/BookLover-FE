import { AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { notifications } from "@mantine/notifications";

export const showSuccess = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Thành công!",
    message,
    color: "green",
    radius: "md",
    withBorder: true,
    icon: <CheckCircle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: "#E6F9EE", 
      },
    },
  });
};

export const showError = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Có lỗi xảy ra!",
    message,
    color: "red",
    radius: "md",
    withBorder: true,
    icon: <XCircle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: "#FDECEC", 
      },
    },
  });
};

export const showWarning = (message: string, title?: string) => {
  notifications.show({
    title: title ?? "Cảnh báo!",
    message,
    color: "yellow",
    radius: "md",
    withBorder: true,
    icon: <AlertTriangle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: "#FFF7E1",
      },
    },
  });
};
