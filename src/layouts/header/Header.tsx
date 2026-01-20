import {
    Button,
    Container,
    Group,
    ThemeIcon,
    Title,
    UnstyledButton,
    useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBook, IconMoon, IconSun } from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const links = [
    { link: "/", label: "Trang chủ" },
    { link: "/books", label: "Cửa hàng" },
    { link: "/about", label: "Về chúng tôi" },
    { link: "/community", label: "Cộng đồng" },
];

const Header = () => {
    const [, { close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const navigate = useNavigate();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const items = links.map((link) => (
        <Link
            key={link.label}
            to={link.link}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
            style={{
                color: active === link.link ? "var(--mantine-color-orange-filled)" : undefined,
                backgroundColor:
                    active === link.link ? "var(--mantine-color-orange-light)" : undefined,
            }}
            onClick={() => {
                setActive(link.link);
                close();
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <header className="h-[70px] bg-white dark:bg-neutral-900 border-b dark:border-gray-800 sticky top-0 z-50">
            <Container size="lg" className="flex justify-between items-center h-full">
                <Link to="/" className="flex items-center gap-2 no-underline text-inherit">
                    <ThemeIcon variant="light" size="lg" color="orange">
                        <IconBook size={24} />
                    </ThemeIcon>
                    <Title order={3} className="tracking-tight text-orange-700">
                        BookLover
                    </Title>
                </Link>

                <Group className="hidden md:flex" gap="xs">
                    {items}
                </Group>

                <Group gap="sm">
                    <UnstyledButton
                        onClick={() => toggleColorScheme()}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {colorScheme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
                    </UnstyledButton>

                    <Button
                        variant="filled"
                        color="green"
                        radius="md"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                    </Button>
                </Group>
            </Container>
        </header>
    );
};

export default Header;
