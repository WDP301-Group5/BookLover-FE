import { AppShell } from "@mantine/core";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { CircleArrowUp } from "lucide-react";
import Header from "./header/Header";
import Footer from "./footer/Footer";

const Layout = () => {
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
