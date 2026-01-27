import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home-page/HomePage";
import Layout from "../layouts/Layout";
import LoginPage from "../pages/login-page/LoginPage";
import RegisterPage from "../pages/register-page/RegisterPage";
import UserProfile from "../pages/user-profile/UserProfile";
import { AdminRoute } from "./admin";
import { AuthorProfile } from "../pages/author-profile/AuthorProfile";

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
        path: "user-profile",
        element: <UserProfile />,
      },
      {
        path: "author-profile",
        element: <AuthorProfile />,
      },
    ],
  },
]);

export default routes;
