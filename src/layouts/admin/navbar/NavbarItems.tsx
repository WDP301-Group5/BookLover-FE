import {
  IconAlertCircle,
  IconChartBarPopular,
  IconGauge,
  IconListCheck,
  IconNotes,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react";
import { Coins, UserLock, type LucideIcon } from "lucide-react";

export type NavbarItem = {
  label: string;
  icon?: TablerIcon | LucideIcon;
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
    label: "Bảng xếp hạng",
    icon: IconChartBarPopular,
    link: "/admin/top",
  },
  {
    label: "Chủ đề truyện",
    icon: IconNotes,
    link: "/admin/catalog/topic",
  },
  {
    label: "Quản trị viên",
    icon: UserLock,
    link: "/admin/account",
  },
  {
    label: "Quản lý người dùng",
    icon: IconUsers,
    link: "/admin/users",
  },
  {
    label: "Quản lý doanh thu",
    icon: Coins,
    link: "/admin/transactions",
  },
  {
    label: "Kiểm duyệt nội dung",
    icon: IconListCheck,
    links: [
      { label: "Kiểm duyệt Truyện", link: "/admin/censor/stories" },
      { label: "Kiểm duyệt Chương", link: "/admin/censor/chapters" },
      { label: "Từ khóa cấm", link: "/admin/censor/keywords" },
    ],
  },
  {
    label: "Yêu cầu rút tiền",
    icon: IconNotes,
    link: "/admin/withdraws",
  },
  {
    label: "Báo cáo vi phạm",
    icon: IconAlertCircle,
    link: "/admin/reports",
  },
];
