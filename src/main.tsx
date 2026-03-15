import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/tiptap/styles.css";
import { MantineProvider, useComputedColorScheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { GOOGLE_CLIENT_ID } from "./constants";
import routes from "./routes";
import { appTheme } from "./styles/theme";

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

// Sync Mantine color scheme with HTML element for TailwindCSS
const ColorSchemeSyncer = () => {
  const computedColorScheme = useComputedColorScheme();

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-mantine-color-scheme", computedColorScheme);
  }, [computedColorScheme]);

  return null;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* khong can quan tam */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        {/* provider cua thu vien ui */}
        <MantineProvider theme={appTheme} defaultColorScheme={colorScheme}>
          <ColorSchemeSyncer />
          <ModalsProvider>
            <NavigationProgress />
            {/* toast thong bao */}
            <Notifications position="top-right" zIndex={1000} />
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
    </GoogleOAuthProvider>
  </StrictMode>,
);
