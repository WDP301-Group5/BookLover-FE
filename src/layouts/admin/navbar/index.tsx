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
        <nav className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r dark:border-gray-800 transition-[width] duration-300">
            <div
                className={`h-16 flex items-center border-b dark:border-gray-800 ${isOpen ? "" : "justify-center"}`}
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
                className={`h-16 flex items-center border-t dark:border-gray-800 ${isOpen ? "" : "justify-center"}`}
            >
                {isOpen && <AdminProfile />}
            </div>
        </nav>
    );
};
