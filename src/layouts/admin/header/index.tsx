import { ActionIcon, Group, Title } from "@mantine/core";
import { IconBell, IconMenu2, IconSettings } from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";

export const AdminHeader = () => {
    const { toggle } = useNavbarStore();

    return (
        <header className="px-6 h-16 bg-white dark:bg-neutral-900 border-b dark:border-gray-800 flex items-center justify-between sticky top-0 z-10">
            <Group>
                <ActionIcon variant="subtle" color="gray" onClick={toggle} size="lg">
                    <IconMenu2 size={24} />
                </ActionIcon>
                <Title order={3}>Dashboard</Title>
            </Group>

            <Group>
                <ActionIcon variant="subtle" color="dark" size="lg">
                    <IconBell />
                </ActionIcon>
                <ActionIcon variant="subtle" color="dark" size="lg">
                    <IconSettings />
                </ActionIcon>
            </Group>
        </header>
    );
};
