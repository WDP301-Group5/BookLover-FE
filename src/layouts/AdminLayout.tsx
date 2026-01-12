import {
    AppShell,
    useMantineColorScheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./layout/admin/AdminNavbar.tsx";
import { useNavbarStore } from "../stores/NavbarStore.ts";
import AdminHeader from "./layout/admin/AdminHeader.tsx";

const AdminLayout = () => {

    const { isOpen } = useNavbarStore();
    const { colorScheme } = useMantineColorScheme();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: isOpen ? 300 : 100, breakpoint: "sm", collapsed: { mobile: !isOpen } }}
            transitionDuration={500}
            transitionTimingFunction="ease"
            styles={{
                navbar: {
                    transition: "width 500ms ease",
                    overflow: "hidden",
                },
            }}
        >
            <AppShell.Header>
                <AdminHeader />
            </AppShell.Header>

            <AppShell.Navbar>
                <AdminNavbar />
            </AppShell.Navbar>

            <AppShell.Main
                className={`flex flex-col ${colorScheme === "dark" ? "bg-neutral-900" : "bg-white"
                    }`}
            >
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default AdminLayout;
