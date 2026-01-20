import {
    Anchor,
    Button,
    Container,
    Divider,
    Grid,
    Group,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import {
    IconBook,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandTwitter,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-neutral-900 border-t dark:border-gray-800 py-12 mt-auto">
            <Container size="lg">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Group gap="sm" mb="md">
                            <ThemeIcon variant="light" size="lg" color="orange">
                                <IconBook size={24} />
                            </ThemeIcon>
                            <Title order={3} className="tracking-tight text-orange-700">
                                BookLover
                            </Title>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xl">
                            Trang web yêu thích dành cho những người yêu sách. Khám phá, chia sẻ và
                            kết nối với cộng đồng đọc giả.
                        </Text>
                        <Group gap="md">
                            <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
                                <IconBrandFacebook size={20} />
                            </ThemeIcon>
                            <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
                                <IconBrandInstagram size={20} />
                            </ThemeIcon>
                            <ThemeIcon size="lg" radius="xl" color="gray" variant="light">
                                <IconBrandTwitter size={20} />
                            </ThemeIcon>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, md: 2 }}>
                        <Title order={5} mb="md">
                            Khám phá
                        </Title>
                        <div className="flex flex-col gap-2">
                            <Anchor component={Link} to="/books" size="sm" c="dimmed">
                                Tất cả sách
                            </Anchor>
                            <Anchor component={Link} to="/categories" size="sm" c="dimmed">
                                Danh mục
                            </Anchor>
                            <Anchor component={Link} to="/authors" size="sm" c="dimmed">
                                Tác giả
                            </Anchor>
                            <Anchor component={Link} to="/trending" size="sm" c="dimmed">
                                Thịnh hành
                            </Anchor>
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, md: 2 }}>
                        <Title order={5} mb="md">
                            Ứng dụng
                        </Title>
                        <div className="flex flex-col gap-2">
                            <Anchor component={Link} to="/about" size="sm" c="dimmed">
                                Về chúng tôi
                            </Anchor>
                            <Anchor component={Link} to="/contact" size="sm" c="dimmed">
                                Liên hệ
                            </Anchor>
                            <Anchor component={Link} to="/faq" size="sm" c="dimmed">
                                Câu hỏi thường gặp
                            </Anchor>
                        </div>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Title order={5} mb="md">
                            Bản tin
                        </Title>
                        <Text size="sm" c="dimmed" mb="md">
                            Đăng ký nhận bản tin để cập nhật những cuốn sách mới nhất mỗi tuần.
                        </Text>
                        <Group gap="xs" wrap="nowrap">
                            <div className="flex-1 px-3 py-2 border rounded-md dark:border-gray-700 text-sm opacity-60">
                                Email của bạn
                            </div>
                            <Button color="orange" radius="md">
                                Tham gia
                            </Button>
                        </Group>
                    </Grid.Col>
                </Grid>

                <Divider my="xl" className="dark:border-gray-800" />

                <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                        &copy; {new Date().getFullYear()} BookLover. Tất cả quyền được bảo lưu.
                    </Text>
                    <Group gap="xl">
                        <Anchor size="xs" c="dimmed">
                            Chính sách bảo mật
                        </Anchor>
                        <Anchor size="xs" c="dimmed">
                            Điều khoản sử dụng
                        </Anchor>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
};

export default Footer;
