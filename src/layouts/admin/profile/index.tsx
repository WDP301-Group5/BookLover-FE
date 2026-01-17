import { Avatar, Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useNavbarStore } from "../../../stores/NavbarStore";

const user = {
    avartar: "",
    fullName: "Admin",
    email: "admin@email.com",
};

export const AdminProfile = () => {
    const navigate = useNavigate();
    const { isOpen } = useNavbarStore();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <Group
            p="md"
            wrap="nowrap"
            justify={isOpen ? "space-between" : "center"}
            w="100%"
            style={{ overflow: "hidden" }}
        >
            <Tooltip label={user.fullName} position="right" disabled={isOpen} withArrow>
                <Group wrap="nowrap" gap="sm" style={{ flex: isOpen ? 1 : 0, minWidth: 0 }}>
                    <Avatar
                        src={user?.avartar}
                        radius="xl"
                        color="orange"
                        style={{ flexShrink: 0 }}
                    />

                    {isOpen && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Text size="sm" fw={500} truncate>
                                {user?.fullName}
                            </Text>
                            <Text size="xs" c="dimmed" truncate>
                                {user?.email}
                            </Text>
                        </div>
                    )}
                </Group>
            </Tooltip>

            {isOpen && (
                <Tooltip label="Đăng xuất" position="top" withArrow>
                    <UnstyledButton
                        onClick={handleLogout}
                        className="p-2 rounded-full transition-colors group hover:bg-red-50 dark:hover:bg-red-900/20"
                        style={{ flexShrink: 0 }}
                    >
                        <IconLogout
                            size={20}
                            stroke={1.5}
                            className="text-gray-500 dark:text-gray-400 group-hover:text-red-500"
                        />
                    </UnstyledButton>
                </Tooltip>
            )}
        </Group>
    );
};
