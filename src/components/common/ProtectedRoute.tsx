import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { isTokenExpired } from "../../utils/token";
import { showWarning } from "../../utils/notifications";

export const ProtectedRoute = () => {
  const { isLoggedIn, logout } = useUserStore();
  const token = localStorage.getItem("token");
  const isExpired = !token || isTokenExpired(token);
  const handled = useRef(false);

  useEffect(() => {
    if (isLoggedIn && isExpired && !handled.current) {
      handled.current = true;
      logout();
      showWarning(
        "Vui lòng đăng nhập lại để tiếp tục.",
        "Phiên đăng nhập đã hết hạn",
      );
    }
  }, [logout, isLoggedIn, isExpired]);

  if (!isLoggedIn || isExpired) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
