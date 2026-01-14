import { IconFlag, IconGauge, IconListCheck, IconNotes, IconUsers, type IconProps } from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavbarItem = {
    label: string;
    icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
    link?: string;
    links?: NavbarItem[];
};

export const NAVBAR_ITEMS: NavbarItem[] = [
    {
      label: "Trang chủ", icon: IconGauge, link: "/admin"
    },
    {
        label: "Thể loại Truyện",
        icon: IconNotes,
        link: "/admin/catalog/genre",
    },
    {
        label: "Quản trị viên",
        icon: IconUsers,
        link: "/admin/account",
    },
    {
        label: "Kiểm duyệt nội dung",
        icon: IconListCheck,
        link: "/admin/censor",
    },
    {
        label: "Báo cáo vi phạm",
        icon: IconFlag,
        link: "/admin/users",
    },
];
