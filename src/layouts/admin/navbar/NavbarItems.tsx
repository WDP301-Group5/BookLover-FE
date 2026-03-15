import {
  IconAlertCircle,
  IconGauge,
  IconListCheck,
  IconNotes,
  IconUsers,
  type IconProps,
} from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavbarItem = {
  label: string;
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  link?: string;
  links?: NavbarItem[];
};

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    label: "Trang chủ",
    icon: IconGauge,
    link: "/admin/dashboard",
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
    links: [
      { label: "Kiểm duyệt Truyện", link: "/admin/censor/stories" },
      { label: "Kiểm duyệt Chương", link: "/admin/censor/chapters" },
    ],
  },
  {
    label: "Báo cáo vi phạm",
    icon: IconAlertCircle,
    link: "/admin/reports",
  },
];
