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
            <AppShell.Navbar style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}>
                <AdminNavbar />
            </AppShell.Navbar>

            <AppShell.Main 
                className="min-h-screen flex flex-col transition-[padding] duration-300"
                style={{ backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))" }}
            >
                <AdminHeader />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                <AdminFooter />
            </AppShell.Main>
        </AppShell>
    );
};
