import { Navigate, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../../layouts/admin";

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
    ],
};
