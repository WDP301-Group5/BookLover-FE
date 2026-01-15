import { ActionIcon, ScrollArea } from "@mantine/core";
import {
    IconMenu2
} from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";
import { AdminLogo } from "../logo";
import { AdminProfile } from "../profile";
import { LinksGroup } from "./LinksGroup";
import { NAVBAR_ITEMS } from "./NavbarItems";


export const AdminNavbar = () => {
    const { isOpen, toggle } = useNavbarStore();
    const links = NAVBAR_ITEMS.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav 
            className="flex flex-col h-full transition-[width] duration-300"
            style={{ 
                backgroundColor: "var(--mantine-color-body)",
                borderRight: "1px solid var(--mantine-color-default-border)"
            }}
        >
            <div
                className={`h-16 flex items-center border-b ${isOpen ? "" : "justify-center"}`}
                style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
            >
                {isOpen && <AdminLogo />}
                <div className="ml-auto pr-2 md:hidden">
                    <ActionIcon variant="subtle" color="gray" onClick={toggle} size="lg">
                        <IconMenu2 size={24} />
                    </ActionIcon>
                </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">{links}</ScrollArea>

            <div
                className={`h-16 flex items-center border-t ${isOpen ? "" : "justify-center"}`}
                style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
            >
                {isOpen && <AdminProfile />}
            </div>
        </nav>
    );
};
