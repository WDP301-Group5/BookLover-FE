import { Anchor, Group, Text } from "@mantine/core";

export const AdminFooter = () => {
    return (
        <footer className="px-6 h-16 border-t dark:border-gray-800 bg-white dark:bg-neutral-900 flex items-center">
            <Group justify="space-between" className="w-full">
                <Text size="sm" c="dimmed">
                    &copy; {new Date().getFullYear()} BookLover. Tất cả quyền được bảo lưu.
                </Text>

                <Group gap="xl">
                    <Anchor size="xs" c="dimmed" href="#">
                        Điều khoản
                    </Anchor>
                    <Anchor size="xs" c="dimmed" href="#">
                        Bảo mật
                    </Anchor>
                    <Anchor size="xs" c="dimmed" href="#">
                        Hỗ trợ
                    </Anchor>
                </Group>
            </Group>
        </footer>
    );
};
