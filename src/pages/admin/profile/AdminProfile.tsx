import {
  Avatar,
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconCheck, IconEdit, IconMail, IconPhone, IconUser, IconX } from "@tabler/icons-react";
import { useState } from "react";

const mockUser = {
    name: "Admin",
    email: "admin@example.com",
    phone: "1234567890",
    avatar: "https://via.placeholder.com/150",
    createdAt: new Date(),
};

const AdminProfilePage = () => {
    const [user, setUser] = useState(mockUser);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
    });

    const handleEdit = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    };

    const handleSave = async () => {
        try {
            // TODO: Implement update profile API call when backend is ready
            // await UserService.updateProfile(formData);
            
            // Update local state with mock data
            setUser({
                ...user,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            });
            
            notifications.show({
                title: "Thành công",
                message: "Cập nhật thông tin thành công",
                color: "green",
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            notifications.show({
                title: "Lỗi",
                message: "Có lỗi xảy ra khi cập nhật thông tin",
                color: "red",
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="xl">
                Thông tin tài khoản
            </Title>

            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Stack align="center" gap="md">
                            <Avatar
                                size={120}
                                radius="xl"
                                color="blue"
                                src={user?.avatar}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || "A"}
                            </Avatar>
                            <Stack align="center" gap="xs">
                                <Title order={3}>{user?.name || "Admin"}</Title>
                                <Badge color="blue" size="lg">
                                    Quản trị viên
                                </Badge>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <Title order={3}>Thông tin cá nhân</Title>
                            {!isEditing && (
                                <Button
                                    leftSection={<IconEdit size={16} />}
                                    onClick={handleEdit}
                                    variant="light"
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                        </Group>

                        <Divider mb="lg" />

                        <Stack gap="md">
                            <TextInput
                                label="Họ và tên"
                                placeholder="Nhập họ và tên"
                                leftSection={<IconUser size={16} />}
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                disabled={!isEditing}
                                size="md"
                            />

                            <TextInput
                                label="Email"
                                placeholder="Nhập email"
                                leftSection={<IconMail size={16} />}
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                disabled={!isEditing}
                                size="md"
                            />

                            <TextInput
                                label="Số điện thoại"
                                placeholder="Nhập số điện thoại"
                                leftSection={<IconPhone size={16} />}
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                disabled={!isEditing}
                                size="md"
                            />

                            {user?.createdAt && (
                                <TextInput
                                    label="Ngày tạo tài khoản"
                                    leftSection={<IconCalendar size={16} />}
                                    value={new Date(user.createdAt).toLocaleDateString("vi-VN")}
                                    disabled
                                    size="md"
                                />
                            )}

                            {isEditing && (
                                <Group justify="flex-end" mt="md">
                                    <Button
                                        variant="outline"
                                        leftSection={<IconX size={16} />}
                                        onClick={handleCancel}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        leftSection={<IconCheck size={16} />}
                                        onClick={handleSave}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </Group>
                            )}
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default AdminProfilePage;
