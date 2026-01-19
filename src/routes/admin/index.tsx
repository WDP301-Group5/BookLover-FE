import { Navigate, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../../layouts/admin";
import AdminProfilePage from "../../pages/admin/profile/AdminProfile";
import NotFoundPage from "../../pages/error/not-found";

export const AdminRoute: RouteObject = {
    path: "/admin",
    element: <AdminLayout />,
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
            path: "profile",
            element: <AdminProfilePage />,
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ],
};
