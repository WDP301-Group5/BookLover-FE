import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../../layouts/admin";
import { GenreManagement } from "../../pages/admin/catalog/genre/GenreManagement";
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
