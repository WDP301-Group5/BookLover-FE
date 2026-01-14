import { ActionIcon, Group, Title } from "@mantine/core";
import { IconBell, IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";
import { useMantineColorScheme } from "@mantine/core";

export const AdminHeader = () => {
    const { toggle } = useNavbarStore();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <header 
            className="px-6 h-16 flex items-center justify-between sticky top-0 z-10"
            style={{ 
                backgroundColor: "var(--mantine-color-body)",
                borderBottom: "1px solid var(--mantine-color-default-border)" 
            }}
        >
            <Group>
                <ActionIcon variant="subtle" color="gray" onClick={toggle} size="lg">
                    <IconMenu2 size={24} />
                </ActionIcon>
                <Title order={3}>Dashboard</Title>
            </Group>

            <Group>
                <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconBell />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg" onClick={toggleColorScheme}>
                    {colorScheme === "dark" ? <IconSun /> : <IconMoon />}
                </ActionIcon>
            </Group>
        </header>
    );
};
