import { AppShell } from "@mantine/core";
import { CircleArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import { setNavigate } from "../lib/navigation";
import { useLogoutCleanup } from "../hooks/useLogoutCleanup";
import Footer from "./footer/Footer";
import Header from "./header/Header";

const Layout = () => {
  const navigate = useNavigate();

  // Cleanup cache khi user logout
  useLogoutCleanup();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Kiểm tra ngay khi load

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppShell transitionDuration={500} transitionTimingFunction="ease">
      <ScrollRestoration />
      {/* Main App */}
      <AppShell.Main className="flex flex-col min-h-screen bg-white dark:bg-neutral-700">
        <Header />
        <div className="flex flex-1 justify-center">
          <div className="max-w-[1080px] w-full">
            <Outlet />
          </div>
        </div>
        <Footer />
      </AppShell.Main>
      {showScrollTop && (
        <AppShell.Footer
          style={{ position: "relative" }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 rounded-full hover:bg-gray-300 transition"
            >
              <CircleArrowUp />
            </button>
          </div>
        </AppShell.Footer>
      )}
    </AppShell>
  );
};

export default Layout;
