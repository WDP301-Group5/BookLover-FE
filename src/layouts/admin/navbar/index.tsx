import { ActionIcon, ScrollArea } from "@mantine/core";
import {
    IconCalendarStats,
    IconGauge,
    IconMenu2,
    IconNotes,
    IconPresentationAnalytics,
    type IconProps,
    IconReport,
} from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { useNavbarStore } from "../../../stores/NavbarStore";
import { AdminLogo } from "../logo";
import { AdminProfile } from "../profile";
import { LinksGroup } from "./LinksGroup";

export type NavbarItem = {
    label: string;
    icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
    link?: string;
    links?: NavbarItem[];
};

const NAVBAR_ITEMS: NavbarItem[] = [
    { label: "Trang chủ", icon: IconGauge, link: "/admin" },
    {
        label: "Danh mục",
        icon: IconNotes,
        links: [{ label: "Thể loại", link: "/admin/catalog/genre" }],
    },
    {
        label: "Người giao hàng",
        icon: IconCalendarStats,
        links: [
            { label: "Danh sách tất cả người giao hàng", link: "/admin/shipperslist" },
            { label: "Người giao hàng đang duyệt", link: "/admin/pendding-shippers" },
        ],
    },
    {
        label: "Quản lý đơn hàng",
        icon: IconNotes,
        link: "/admin/ordermanagement",
    },
    {
        label: "Người dùng",
        icon: IconPresentationAnalytics,
        link: "/admin/users",
    },
    {
        label: "Khiếu nại",
        icon: IconReport,
        links: [
            { label: "Tất cả khiếu nại", link: "/admin/reports" },
            { label: "Danh mục khiếu nại", link: "/admin/report-categories" },
        ],
    },
    {
        label: "Quản lý banner",
        icon: IconNotes,
        links: [{ label: "Danh sách tất cả banner", link: "/admin/banners" }],
    },
];

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
