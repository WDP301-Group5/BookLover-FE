import { AppShell } from "@mantine/core";
import "@mantine/core/styles.css";
import { Outlet } from "react-router-dom";
import { useNavbarStore } from "../../stores/NavbarStore";
import { AdminFooter } from "./footer";
import { AdminHeader } from "./header";
import { AdminNavbar } from "./navbar";

export const AdminLayout = () => {
    const { isOpen } = useNavbarStore();

    return (
        <AppShell
            navbar={{
                width: isOpen ? 300 : 0,
                breakpoint: "sm",
                collapsed: { mobile: !isOpen },
            }}
            transitionDuration={300}
            transitionTimingFunction="ease"
        >
            <AppShell.Navbar>
                <AdminNavbar />
            </AppShell.Navbar>

            <AppShell.Main className="bg-gray-50 dark:bg-neutral-900 min-h-screen flex flex-col transition-[padding] duration-300">
                <AdminHeader />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                <AdminFooter />
            </AppShell.Main>
        </AppShell>
    );
};
