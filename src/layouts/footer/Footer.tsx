import { Anchor, Group, Text } from "@mantine/core";
import classes from "./FooterCentered.module.css";
import { Link } from "react-router-dom";

interface FooterLink {
  link: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "BookLover",
    links: [
      { link: "/", label: "Trang chủ" },
      { link: "#", label: "Khám phá" },
      { link: "#", label: "Thư viện của tôi" },
    ],
  },
  {
    title: "Dành cho bạn",
    links: [
      { link: "#", label: "Đọc miễn phí" },
      { link: "#", label: "Premium" },
      { link: "#", label: "Tải ứng dụng" },
    ],
  },
  {
    title: "Cộng đồng",
    links: [
      { link: "/community/forums", label: "Diễn đàn" },
      { link: "/community/events", label: "Sự kiện" },
      { link: "/community/contests", label: "Cuộc thi" },
    ],
  },
  {
    title: "Nhà văn",
    links: [
      { link: "#", label: "Hướng dẫn công bố" },
      { link: "#", label: "Kiếm tiền" },
      { link: "#", label: "Chương trình hỗ trợ" },
    ],
  },
];

const bottomLinks: FooterLink[] = [
  { link: "/terms", label: "Điều khoản" },
  { link: "/privacy", label: "Quyền riêng tư" },
  { link: "/payment-policy", label: "Chính sách thanh toán" },
  { link: "/help", label: "Trợ giúp" },
  { link: "/contact", label: "Liên hệ" },
];

export default function FooterCentered() {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        {/* Top Section - Link Groups */}
        <div className={classes.topSection}>
          {footerSections.map((section) => (
            <div key={section.title} className={classes.column}>
              <Text fw={600} size="sm" className={classes.sectionTitle}>
                {section.title}
              </Text>
              <div className={classes.linkGroup}>
                {section.links.map((link) => (
                  <Anchor
                    component={Link}
                    key={link.label}
                    to={link.link}
                    c="dimmed"
                    size="sm"
                    className={classes.link}
                  >
                    {link.label}
                  </Anchor>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Legal Links */}
        <div className={classes.bottomSection}>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="sm" wrap="wrap">
              {bottomLinks.map((link) => (
                <Anchor
                  component={Link}
                  key={link.label}
                  to={link.link}
                  c="dimmed"
                  size="xs"
                  className={classes.bottomLink}
                >
                  {link.label}
                </Anchor>
              ))}
            </Group>
            <Text c="dimmed" size="xs">
              &copy; {new Date().getFullYear()} BookLover. Bảo lưu mọi quyền.
            </Text>
          </Group>
        </div>
      </div>
    </footer>
  );
}
