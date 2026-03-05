import { Navigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

interface AdminRouteGuardProps {
	children: React.ReactNode;
}

/**
 * Component bảo vệ route dành cho admin
 * Chỉ cho phép user có role "admin" truy cập
 */
export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
	const { user, isLoggedIn } = useUserStore();

	// Kiểm tra đăng nhập
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	// Kiểm tra role admin
	if (user?.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	// User là admin → render children
	return children;
};
