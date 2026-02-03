import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home-page/HomePage";
import Layout from "../layouts/Layout";
import LoginPage from "../pages/login-page/LoginPage";
import UserProfile from "../pages/user-profile/UserProfile";
import { AdminRoute } from "./admin";
import { AuthorProfile } from "../pages/author-profile/AuthorProfile";
import BuyStonePage from "../pages/purchase/buy-stone/BuyStonePage";

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
        element: <LoginPage />
      },
      {
        path: "user-profile",
        element: <UserProfile />
      },
      {
        path: "author-profile",
        element: <AuthorProfile />
      },
      {
        path: "purchase/spirit-stone",
        element: <BuyStonePage />,
      },
    ],
  },
]);

export default routes;
