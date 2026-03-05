import { Navigate, Outlet, type RouteObject } from "react-router-dom";
// import { AdminRouteGuard } from "../../components/common/AdminRouteGuard";
import { AdminLayout } from "../../layouts/admin";
import { AdminAccountManagement } from "../../pages/admin/account/AdminAccountManagement";
import { GenreManagement } from "../../pages/admin/catalog/genre/GenreManagement";
import NotFoundPage from "../../pages/error/not-found";

export const AdminRoute: RouteObject = {
	path: "/admin",
	element: (
		// <AdminRouteGuard>
		<AdminLayout />
		// </AdminRouteGuard>
	),
	children: [
		{
			index: true,
			element: <Navigate to="dashboard" replace />,
		},
		{
			path: "dashboard",
			element: <div>Dashboard</div>,
		},
		{
			path: "account",
			element: <AdminAccountManagement />,
		},
		{
			path: "catalog",
			element: <Outlet />,
			children: [
				{
					path: "genre",
					element: <GenreManagement />,
				},
			],
		},
		{
			path: "*",
			element: <NotFoundPage />,
		},
	],
};
