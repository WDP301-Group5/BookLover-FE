import { type RouteObject } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { RoleBasedRoute } from "../../components/common/RoleBasedRoute";
import WriteStoryPage from "../../pages/author/WriteStoryPage";
import WriteChapterPage from "../../pages/author/WriteChapterPage";
import MyStoriesPage from "../../pages/author/MyStoriesPage";

export const AuthorRoute: RouteObject = {
  path: "/author",
  element: (
    <RoleBasedRoute
      allowedRoles={["author", "admin"]}
      fallbackRoute="/unauthorized"
    />
  ),
  children: [
    {
      element: <Layout />,
      children: [
        {
          path: "my-stories",
          element: <MyStoriesPage />,
        },
        {
          path: "write-story",
          element: <WriteStoryPage />,
        },
        {
          path: "story/:storySlug/write-chapter",
          element: <WriteChapterPage />,
        },
      ],
    },
  ],
};
