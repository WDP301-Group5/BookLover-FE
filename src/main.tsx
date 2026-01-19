import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { DatesProvider } from "@mantine/dates";
import routes from './routes'
import { appTheme } from './styles/theme'

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
        theme={appTheme}
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
            <RouterProvider router={routes} />
          </DatesProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>
);
