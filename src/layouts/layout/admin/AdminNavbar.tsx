import { Button, ScrollArea } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { IconReport } from "@tabler/icons-react";
import {
    IconCalendarStats,
    IconGauge,
    IconNotes,
    IconPresentationAnalytics,
} from "@tabler/icons-react";
import { LinksGroup } from "./NavbarLinksGroup";
import classes from "./AdminNavbar.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavbarStore } from "../../../stores/NavbarStore";

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
        links: [
            { label: "Phương thức vận chuyển", link: "/admin/shipping-methods" },
        ],
    },
    {
        label: "Quản lý banner",
        icon: IconNotes,
        links: [
            { label: "Danh sách tất cả banner", link: "/admin/banners" }
        ],
    }
];

const AdminNavbar = () => {

    const { isOpen, toggle } = useNavbarStore();

    const links = NAVBAR_ITEMS.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar} style={{ width: isOpen ? 300 : 100, transition: "width 500ms ease" }}>
            <div className="px-3 py-2 border-b">
                <div
                    className={`flex items-center transition-transform duration-500 ease
                        ${isOpen ? "translate-x-[200px]" : "translate-x-0"}`}
                >
                    <Button
                        variant="light"
                        className="!p-1 border !border-green-500 hover:!bg-green-100 transition-transform duration-300"
                        onClick={toggle}
                    >
                        {isOpen ? (
                            <ChevronLeft className="text-green-600" size={24} />
                        ) : (
                            <ChevronRight className="text-green-600" size={24} />
                        )}
                    </Button>
                </div>
            </div>


            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                User
            </div>
        </nav>
    );
};

export default AdminNavbar;