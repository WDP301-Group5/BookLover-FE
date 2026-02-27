import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home-page/HomePage";
import Layout from "../layouts/Layout";
import LoginPage from "../pages/login-page/LoginPage";
import UserProfile from "../pages/user-profile/UserProfile";
import { AdminRoute } from "./admin";
import { AuthorProfile } from "../pages/author-profile/AuthorProfile";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

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
        path: "author-profile",
        element: <AuthorProfile />,
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
    ],
  },
]);

export default routes;
