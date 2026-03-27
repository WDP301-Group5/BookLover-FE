import { type RouteObject } from "react-router-dom";
import Layout from "../../layouts/Layout";
import { RoleBasedRoute } from "../../components/common/RoleBasedRoute";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import WriteStoryPage from "../../pages/author/WriteStoryPage";
import EditStoryPage from "../../pages/author/EditStoryPage";
import WriteChapterPage from "../../pages/author/WriteChapterPage";
import MyStoriesPage from "../../pages/author/MyStoriesPage";

// Allow users to start writing a story (they will become an author after creating the story)
// Only requires authentication, no role check
export const UserWriteStoryRoute: RouteObject = {
  path: "/author/write-story",
  element: <Layout />,
  children: [
    {
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <WriteStoryPage />,
        },
      ],
    },
  ],
};

// My Stories route - requires authentication but accessible to any user
// (they can view their own stories regardless of current role)
export const MyStoriesRoute: RouteObject = {
  path: "/author/my-stories",
  element: <Layout />,
  children: [
    {
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <MyStoriesPage />,
        },
      ],
    },
  ],
};

// Edit Story route - requires authentication
export const EditStoryRoute: RouteObject = {
  path: "/author/story/:storyId/edit-info",
  element: <Layout />,
  children: [
    {
      element: <ProtectedRoute />,
      children: [
        {
          index: true,
          element: <EditStoryPage />,
        },
      ],
    },
  ],
};

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
          path: "story/:storySlug/write-chapter",
          element: <WriteChapterPage />,
        },
      ],
    },
  ],
};
