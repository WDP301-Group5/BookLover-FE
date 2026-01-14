import { Button, Group, Image, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../../../assets/images/not-found-picture.svg";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div 
            className="flex items-center justify-center p-4 py-6 rounded-md shadow-md"
            style={{ 
                backgroundColor: "var(--mantine-color-body)",
                border: "1px solid var(--mantine-color-default-border)"
            }}
        >
            <Stack align="normal" gap="xl">
                <div className="w-full rounded-md overflow-hidden">
                    <Image src={notFoundImage} alt="404 Not Found" className="w-full h-auto" />
                </div>

                <Title order={1} className="text-2xl md:text-4xl text-center">
                    Trang không tồn tại
                </Title>

                <Stack align="center" gap="md">
                    <Text c="dimmed" size="lg" ta="center" maw={500}>
                        Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang
                        một địa chỉ khác.
                    </Text>
                </Stack>

                <Group justify="center" className="flex-row sm:flex-col">
                    <Button
                        variant="filled"
                        color="orange"
                        size="lg"
                        radius="md"
                        onClick={() => navigate("/")}
                    >
                        Quay lại trang chủ
                    </Button>
                    <Button variant="light" color="orange" size="lg" radius="md">
                        Quay lại trang trước
                    </Button>
                </Group>
            </Stack>
        </div>
    );
};

export default NotFoundPage;
