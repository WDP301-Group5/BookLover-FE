import { Anchor, Group, Text } from "@mantine/core";

export const AdminFooter = () => {
    return (
        <footer 
            className="px-6 h-16 flex items-center"
            style={{ 
                backgroundColor: "var(--mantine-color-body)",
                borderTop: "1px solid var(--mantine-color-default-border)" 
            }}
        >
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
