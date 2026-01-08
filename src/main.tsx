import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { DatesProvider } from "@mantine/dates";
import HomePage from './pages/HomePage.tsx'
import Layout from './components/Layout.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ]
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
    },
  },
});

const colorScheme =
  localStorage.getItem("mantine-color-scheme-value") &&
  localStorage.getItem("mantine-color-scheme-value") === "dark"
    ? "dark"
    : "light";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* khong can quan tam */}
    <QueryClientProvider client={queryClient}>
      {/* provider cua thu vien ui */}
      <MantineProvider
        defaultColorScheme={colorScheme}
      >
        <ModalsProvider>
          <NavigationProgress />
          {/* toast thong bao */}
          <Notifications />
          {/* routes */}
          <DatesProvider
            settings={{
              locale: "vn",
              firstDayOfWeek: 1,
              timezone: "Asia/Ho_Chi_Minh",
            }}
          >
            <RouterProvider router={router} />
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
