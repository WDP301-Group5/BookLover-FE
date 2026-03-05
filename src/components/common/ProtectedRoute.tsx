import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useUserStore } from "../../stores/useUserStore";
import { isTokenExpired } from "../../utils/token";

export const ProtectedRoute = () => {
  const { isLoggedIn, logout } = useUserStore();
  const token = localStorage.getItem("token");
  const isExpired = !token || isTokenExpired(token);
  const handled = useRef(false);

  useEffect(() => {
    if (isLoggedIn && isExpired && !handled.current) {
      handled.current = true;
      logout();
      notifications.show({
        title: "Phiên đăng nhập đã hết hạn",
        message: "Vui lòng đăng nhập lại để tiếp tục.",
        color: "orange",
        autoClose: 3000,
      });
    }
  }, [logout, isLoggedIn, isExpired]);

  if (!isLoggedIn || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
