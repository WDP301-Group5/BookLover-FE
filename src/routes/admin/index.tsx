import { Navigate, Outlet, type RouteObject } from "react-router-dom";
// import { AdminRouteGuard } from "../../components/common/AdminRouteGuard";
import { RoleBasedRoute } from "../../components/common/RoleBasedRoute";
import { AdminLayout } from "../../layouts/admin";
import { AdminAccountManagement } from "../../pages/admin/account/AdminAccountManagement";
import { GenreManagement } from "../../pages/admin/catalog/genre/GenreManagement";
import { AdminChapterModeration } from "../../pages/admin/censor/AdminChapterModeration";
import { AdminStoryModeration } from "../../pages/admin/censor/AdminStoryModeration";
import ReportManagement from "../../pages/admin/reports/ReportManagement";
import NotFoundPage from "../../pages/error/not-found";
import { UserManagementPage } from "../../pages/admin/user-management/UserManagementPage";

export const AdminRoute: RouteObject = {
  path: "/admin",
  element: (
    <RoleBasedRoute allowedRoles="admin" fallbackRoute="/unauthorized" />
  ),
  children: [
    {
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
          path: "account",
          element: <AdminAccountManagement />,
        },
        {
          path: "users",
          element: <UserManagementPage />
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
          path: "censor",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Navigate to="stories" replace />,
            },
            {
              path: "stories",
              element: <AdminStoryModeration />,
            },
            {
              path: "chapters",
              element: <AdminChapterModeration />,
            },
          ],
        },
        {
          path: "reports",
          element: <ReportManagement />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
};
