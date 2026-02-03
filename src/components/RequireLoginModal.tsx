import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface RequireLoginModalProps {
    opened: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    onLoginClick?: () => void;
    onSignUpClick?: () => void;
}

const RequireLoginModal = ({
    opened,
    onClose,
    title = "Yêu cầu đăng nhập",
    message = "Vui lòng đăng nhập để sử dụng tính năng này",
    onLoginClick,
    onSignUpClick,
}: RequireLoginModalProps) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/login");
        }
        onClose();
    };

    const handleSignUpClick = () => {
        if (onSignUpClick) {
            onSignUpClick();
        } else {
            navigate("/register");
        }
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            zIndex={3000}
            title={
                <Group gap="xs">
                    <IconAlertCircle size={24} className="text-orange-500" stroke={2.5} />
                    <span className="text-lg font-semibold text-gray-800">{title}</span>
                </Group>
            }
            centered
            size="sm"
            radius="lg"
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            className="shadow-lg"
        >
            <Stack gap="md" className="py-4">
                <Text className="text-gray-600 text-center leading-relaxed">{message}</Text>

                <Group grow className="pt-2">
                    <Button variant="default" onClick={onClose} radius="md" className="font-medium">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleLoginClick}
                        radius="md"
                        className="font-medium bg-blue-600 hover:bg-blue-700"
                    >
                        Đăng nhập
                    </Button>
                </Group>

                <Text size="sm" className="text-center text-gray-500 pt-2">
                    Chưa có tài khoản?{" "}
                    <button
                        onClick={handleSignUpClick}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        Đăng ký ngay
                    </button>
                </Text>
            </Stack>
        </Modal>
    );
};

export default RequireLoginModal;
