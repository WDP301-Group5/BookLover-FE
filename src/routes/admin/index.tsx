import { Navigate, Outlet, type RouteObject } from "react-router-dom";
// import { AdminRouteGuard } from "../../components/common/AdminRouteGuard";
import { RoleBasedRoute } from "../../components/common/RoleBasedRoute";
import { AdminLayout } from "../../layouts/admin";
import { AdminAccountManagement } from "../../pages/admin/account/AdminAccountManagement";
import { GenreManagement } from "../../pages/admin/catalog/genre/GenreManagement";
import { AdminChapterModeration } from "../../pages/admin/censor/AdminChapterModeration";
import { AdminStoryModeration } from "../../pages/admin/censor/AdminStoryModeration";
import { BannedKeywordManagement } from "../../pages/admin/censor/BannedKeywordManagement";
import AdminDashboardPage from "../../pages/admin/dashboard/AdminDashboardPage";
import ReportManagement from "../../pages/admin/reports/ReportManagement";
import { AdminTransactionPage } from "../../pages/admin/transaction/AdminTransactionPage";
import { UserManagementPage } from "../../pages/admin/user-management/UserManagementPage";
import TopicManagementPage from "../../pages/admin/catalog/topic/TopicManagemantPage";
import NotFoundPage from "../../pages/error/not-found";
import AdminRankingPage from "../../pages/admin/ranking/AdminRankingPage";
import WithdrawPage from "../../pages/admin/withdraw/WithdrawPage";

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
          element: <AdminDashboardPage />,
        },
        {
          path: "top",
          element: <AdminRankingPage />,
        },
        {
          path: "account",
          element: <AdminAccountManagement />,
        },
        {
          path: "users",
          element: <UserManagementPage />,
        },
        {
          path: "transactions",
          element: <AdminTransactionPage />,
        },
        {
          path: "catalog",
          element: <Outlet />,
          children: [
            {
              path: "genre",
              element: <GenreManagement />,
            },
            {
              path: "topic",
              element: <TopicManagementPage/>,
            }
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
            {
              path: "keywords",
              element: <BannedKeywordManagement />,
            },
          ],
        },
        {
          path: "withdraws",
          element: <WithdrawPage />,
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
