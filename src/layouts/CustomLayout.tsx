import {
    AppShell,
    useMantineColorScheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

const CustomLayout = () => {

    const { colorScheme } = useMantineColorScheme();

    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60 }}
            transitionDuration={500}
            transitionTimingFunction="ease"
        >
            <ScrollRestoration />

            <AppShell.Header>
                <Header />
            </AppShell.Header>

            <AppShell.Main
                className={`flex flex-col ${colorScheme === "dark" ? "bg-neutral-900" : "bg-white"
                    }`}
            >
                <Outlet />
            </AppShell.Main>

            <AppShell.Footer>
                <Footer />
            </AppShell.Footer>
        </AppShell>
    );
};

export default CustomLayout;
