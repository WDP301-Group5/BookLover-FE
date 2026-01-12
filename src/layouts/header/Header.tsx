import { useState } from 'react';
import {
    Container,
    Group,
    Title,
    useMantineTheme,
    useMantineColorScheme,
    Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';

const links = [
    { link: '/about', label: 'Về chúng tôi' },
    { link: '/pricing', label: 'Bảng giá' },
    { link: '/learn', label: 'Học hỏi' },
    { link: '/community', label: 'Cộng đồng' },
    { link: '/login', label: 'Đăng nhập' },
];

const Header = () => {
    const [, { close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const items = links.map((link) => (
        <Link
            key={link.label}
            to={link.link}
            className="block leading-none px-3 py-2 text-sm rounded-md"
            style={{
                color: active === link.link ? theme.white : theme.colors.gray[5],
            }}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                navigate(link.link);
                close();
            }}
        >
            {link.label}
        </Link>
    ));

    return (
        <div className="h-[60px] bg-stone-500 border-b-2 border-black">
            <Container className="flex justify-between items-center h-full">
                <Title order={3}>Logo</Title>
                <Button
                    className='text-white'
                    variant='filled'
                    onClick={() => toggleColorScheme()}
                >
                    {colorScheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
                </Button>
                <Group className="hidden sm:flex">
                    {items}
                </Group>
            </Container>
        </div>
    );
};

export default Header;