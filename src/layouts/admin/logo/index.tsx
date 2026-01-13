import { Group, ThemeIcon, Title } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { useNavbarStore } from "../../../stores/NavbarStore";

export const AdminLogo = () => {
    const { isOpen } = useNavbarStore();

    return (
        <Group
            p="md"
            gap="sm"
            justify={isOpen ? "flex-start" : "center"}
            wrap="nowrap"
            style={{ overflow: "hidden" }}
        >
            <ThemeIcon variant="light" size="lg" color="orange" style={{ flexShrink: 0 }}>
                <IconBook size={24} />
            </ThemeIcon>
            {isOpen && (
                <Title
                    order={4}
                    className="tracking-tight text-orange-700"
                    style={{ whiteSpace: "nowrap" }}
                >
                    BookLover
                </Title>
            )}
        </Group>
    );
};
