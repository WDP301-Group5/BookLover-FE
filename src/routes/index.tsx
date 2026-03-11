// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import Layout from "../layouts/Layout";
import { AuthorProfile } from "../pages/author-profile/AuthorProfile";
import BuyVipPlanPage from "../pages/buy-vip-plan/BuyVipPlanPage";
import HomePage from "../pages/home-page/HomePage";
import LoginPage from "../pages/login-page/LoginPage";
import BuyStonePage from "../pages/purchase/buy-stone/BuyStonePage";
import RegisterPage from "../pages/register-page/RegisterPage";
import StoryDetailPage from "../pages/story-detail-page/StoryDetailPage";
import UserProfile from "../pages/user-profile/UserProfile";
import VerifyEmailPage from "../pages/verify-email-page/VerifyEmailPage";
import { AdminRoute } from "./admin";
import ForgotPasswordPage from "../pages/forgot-password/ForgotPasswordPage";
import ResetPasswordPage from "../pages/reset-password/ResetPasswordPage";
import ChapterPage from "../pages/chapter-page/ChapterPage";

const routes = createBrowserRouter([
  AdminRoute,
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "author-profile/:authorId",
        element: <AuthorProfile />,
      },
      {
        path: "purchase/spirit-stone",
        element: <BuyStonePage />,
      },
      {
        path: "purchase/vip-plan",
        element: <BuyVipPlanPage />,
      },
      {
        path: "story/:slug",
        element: <StoryDetailPage />,
      },
      {
        path: "truyen/:storySlug/chuong/:chapterNumber",
        element: <ChapterPage />,
      },
      // Routes below require the user to be authenticated with a valid token.
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "user-profile",
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "*",
        element: <HomePage />,
      },
    ],
  },
]);

export default routes;
