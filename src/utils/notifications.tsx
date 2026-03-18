import { notifications } from "@mantine/notifications";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const isDarkMode = () => {
  if (typeof document !== "undefined") {
    const mantineScheme =
      document.documentElement.getAttribute("data-mantine-color-scheme");
    if (mantineScheme) return mantineScheme === "dark";
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const showSuccess = (message: string, title?: string) => {
  const dark = isDarkMode();

  notifications.show({
    title: title ?? "Thành công!",
    message,
    radius: "md",
    withBorder: true,
    icon: <CheckCircle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: dark ? "#122018" : "#E6F9EE",
        border: `1px solid ${dark ? "#2f9e44" : "#40c057"}`,
        color: dark ? "#ffffff" : "#000000",
      },
      title: {
        color: dark ? "#ffffff" : "#000000",
      },
      description: {
        color: dark ? "#d9d9d9" : "#495057",
      },
      icon: {
        backgroundColor: "#40c057",
        color: "#ffffff",
      },
      closeButton: {
        color: dark ? "#d9d9d9" : "#495057",
      },
    },
  });
};

export const showError = (message: string, title?: string) => {
  const dark = isDarkMode();

  notifications.show({
    title: title ?? "Có lỗi xảy ra!",
    message,
    radius: "md",
    withBorder: true,
    icon: <XCircle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: dark ? "#2A1616" : "#FDECEC",
        border: `1px solid ${dark ? "#fa5252" : "#e03131"}`,
        color: dark ? "#ffffff" : "#000000",
      },
      title: {
        color: dark ? "#ffffff" : "#000000",
      },
      description: {
        color: dark ? "#d9d9d9" : "#495057",
      },
      icon: {
        backgroundColor: "#fa5252",
        color: "#ffffff",
      },
      closeButton: {
        color: dark ? "#d9d9d9" : "#495057",
      },
    },
  });
};

export const showWarning = (message: string, title?: string) => {
  const dark = isDarkMode();

  notifications.show({
    title: title ?? "Cảnh báo!",
    message,
    radius: "md",
    withBorder: true,
    icon: <AlertTriangle size={20} color="white" />,
    styles: {
      root: {
        backgroundColor: dark ? "#2A2414" : "#FFF7E1",
        border: `1px solid ${dark ? "#fcc419" : "#f59f00"}`,
        color: dark ? "#ffffff" : "#000000",
      },
      title: {
        color: dark ? "#ffffff" : "#000000",
      },
      description: {
        color: dark ? "#d9d9d9" : "#495057",
      },
      icon: {
        backgroundColor: "#fcc419",
        color: "#ffffff",
      },
      closeButton: {
        color: dark ? "#d9d9d9" : "#495057",
      },
    },
  });
};