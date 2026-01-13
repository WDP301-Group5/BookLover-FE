import { ScrollArea } from "@mantine/core";
import {
    IconCalendarStats,
    IconGauge,
    IconNotes,
    IconPresentationAnalytics,
    IconReport,
    IconSettings,
} from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";
import { AdminLogo } from "../logo";
import { AdminProfile } from "../profile";
import { LinksGroup } from "./LinksGroup";

const NAVBAR_ITEMS = [
    { label: "Trang chủ", icon: IconGauge, link: "/admin" },
    {
        label: "Cửa hàng",
        icon: IconNotes,
        links: [
            { label: "Danh sách tất cả cửa hàng", link: "/admin/shops" },
            { label: "Cửa hàng đang duyệt", link: "/admin/pendingshops/" },
            { label: "Thống kê doanh thu", link: "/admin/shops-revenue" },
        ],
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
    { label: "Người dùng", icon: IconPresentationAnalytics, link: "/admin/users" },

    {
        label: "Khiếu nại",
        icon: IconReport,
        links: [
            { label: "Tất cả khiếu nại", link: "/admin/reports" },
            { label: "Danh mục khiếu nại", link: "/admin/report-categories" },
        ],
    },
    {
        label: "Cài đặt",
        icon: IconSettings,
        links: [{ label: "Phương thức vận chuyển", link: "/admin/shipping-methods" }],
    },
    {
        label: "Quản lý banner",
        icon: IconNotes,
        links: [{ label: "Danh sách tất cả banner", link: "/admin/banners" }],
    },
];

export const AdminNavbar = () => {
    const { isOpen } = useNavbarStore();
    const links = NAVBAR_ITEMS.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r dark:border-gray-800 transition-[width] duration-300">
            <div
                className={`h-[72px] flex items-center border-b dark:border-gray-800 ${isOpen ? "" : "justify-center"}`}
            >
                {isOpen && <AdminLogo />}
            </div>

            <ScrollArea className="flex-1 px-3 py-4">{links}</ScrollArea>

            <div
                className={`h-[88px] flex items-center border-t dark:border-gray-800 ${isOpen ? "" : "justify-center"}`}
            >
                {isOpen && <AdminProfile />}
            </div>
        </nav>
    );
};
