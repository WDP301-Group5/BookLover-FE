import { ActionIcon, Group, Text, Title } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";

export const AdminHeader = () => {
    const { toggle } = useNavbarStore();

    return (
        <header className="px-6 h-[72px] bg-white dark:bg-neutral-900 border-b dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
            <Group>
                <ActionIcon variant="subtle" color="gray" onClick={toggle} size="lg">
                    <IconMenu2 size={24} />
                </ActionIcon>
                <Title order={2}>Dashboard</Title>
            </Group>

            <Group>
                <Text
                    size="sm"
                    fw={500}
                    className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full dark:bg-orange-900/20 dark:text-orange-400"
                >
                    Hệ thống: Hoạt động
                </Text>
            </Group>
        </header>
    );
};
