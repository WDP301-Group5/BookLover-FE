import { Container, Group, Stack, Text, Anchor, Box } from "@mantine/core";
import { BookOpen } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto"
    >
      {/* Main Footer Content */}
      <Container size="xl" py={48}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <Stack gap="md">
            <Group gap="xs">
              <Box className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </Box>
              <Text
                size="xl"
                fw={700}
                className="text-orange-600 dark:text-orange-500"
              >
                BookLover
              </Text>
            </Group>
            <Text size="sm" c="dimmed" lh={1.6}>
              Trang web yêu thích dành cho những người yêu sách. Khám phá, chia
              sẻ và kết nối với cộng đồng độc giả.
            </Text>
          </Stack>

          {/* Discover Section */}
          <Stack gap="md">
            <Text
              size="md"
              fw={600}
              className="text-gray-900 dark:text-gray-100"
            >
              Khám phá
            </Text>
            <Stack gap="xs">
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Tất cả sách
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Danh mục
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Tác giả
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Thịnh hành
              </Anchor>
            </Stack>
          </Stack>

          {/* Application Section */}
          <Stack gap="md">
            <Text
              size="md"
              fw={600}
              className="text-gray-900 dark:text-gray-100"
            >
              Ứng dụng
            </Text>
            <Stack gap="xs">
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Về chúng tôi
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Liên hệ
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Câu hỏi thường gặp
              </Anchor>
            </Stack>
          </Stack>
        </div>
      </Container>

      {/* Bottom Bar */}
      <Box className="border-t border-gray-200 dark:border-gray-800">
        <Container size="xl" py="md">
          <Group
            justify="space-between"
            gap="md"
            className="flex-col md:flex-row"
          >
            <Text size="sm" c="dimmed">
              © {currentYear} BookLover. Tất cả quyền được bảo lưu.
            </Text>
            <Group gap="xl">
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Chính sách bảo mật
              </Anchor>
              <Anchor
                href="#"
                size="sm"
                c="dimmed"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Điều khoản sử dụng
              </Anchor>
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
