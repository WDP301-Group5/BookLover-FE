import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Modal,
    NumberInput,
    Skeleton,
    Text,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import RequireLoginModal from "../../../components/RequireLoginModal";
import { useCreateOrder } from "../../../hooks/useOrder";
import socket from "../../../lib/socket";
import { useUserStore } from "../../../stores/useUserStore";

const RATE = 1;
const MIN_AMOUNT = 1000;

const BuyStonePage = () => {
    /* =======================
   * STATE
   ======================= */

    // Payment
    const [amount, setAmount] = useState<number | null>(null);
    const stones = amount ? amount * RATE : 0;

    // Modal
    const [opened, setOpened] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [loginNotice, setLoginNotice] = useState(false);

    // Status
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const { isLoggedIn: isUserLoggedIn, logout } = useUserStore();

    // Transaction
    const [appTransId, setAppTransId] = useState<string | null>(null);

    const { mutate, isPending, data } = useCreateOrder();

    /* =======================
   * TRANSACTION CODE
   ======================= */
    const transactionCode = useMemo(() => {
        return `NAP-LINH-THACH_${Date.now()}`;
    }, []);

    /* =======================
   * EFFECTS
   ======================= */

    // Nhận app_trans_id từ API
    useEffect(() => {
        if (data?.status === 401) {
            setOpened(false);
            setLoginNotice(true);
            // lỗi 401 nên là cho logout luôn
            logout();
            return;
        }
        if (data?.app_trans_id) {
            setAppTransId(data.app_trans_id);
        }
    }, [data, logout]);

    // Lắng nghe socket thanh toán thành công
    useEffect(() => {
        if (!appTransId) return;

        const eventName = `purchase_status_${appTransId}`;

        const handleSuccess = () => {
            setPurchaseSuccess(true);
        };

        socket.once(eventName, handleSuccess);

        return () => {
            socket.off(eventName, handleSuccess);
        };
    }, [appTransId]);

    // Countdown UI
    useEffect(() => {
        if (!purchaseSuccess) return;

        setCountdown(5);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [purchaseSuccess]);

    // Auto close modal sau 5s
    useEffect(() => {
        if (!purchaseSuccess) return;

        const timeout = setTimeout(() => {
            resetAndClose();
        }, 5000);

        return () => clearTimeout(timeout);
    }, [purchaseSuccess]);

    /* =======================
   * HANDLERS
   ======================= */

    const resetAndClose = () => {
        setOpened(false);
        setConfirmClose(false);
        setPurchaseSuccess(false);
        setAmount(null);
        setAppTransId(null);
    };

    const handlePurchase = () => {
        if (isUserLoggedIn === false) {
            return setLoginNotice(true);
        }
        setOpened(true);

        mutate({
            amount: amount || 0,
            description: transactionCode,
        });
    };

    /* =======================
   * RENDER
   ======================= */

    return (
        <>
            <div className="max-w-xl mx-auto mt-10 px-4">
                <Card shadow="lg" radius="lg" padding="lg">
                    {/* Header */}
                    <div className="rounded-lg p-4 mb-4 bg-blue-500 dark:bg-blue-900 text-white">
                        <Text size="xl" fw={700}>
                            💎 Nạp linh thạch
                        </Text>
                        {/* ƯU ĐIỂM */}
                        <Group grow mb="md">
                            <div className="text-center">
                                <Text fw={600}>🔒 An toàn</Text>
                                <Text size="sm">
                                    Giao dịch được mã hoá và xác thực theo từng đơn hàng
                                </Text>
                            </div>

                            <div className="text-center">
                                <Text fw={600}>⚡ Nhanh chóng</Text>
                                <Text size="sm">
                                    Thanh toán xong, linh thạch được cộng trong vài giây
                                </Text>
                            </div>

                            <div className="text-center">
                                <Text fw={600}>🎯 Chính xác</Text>
                                <Text size="sm">
                                    Hệ thống tự động đối soát, hạn chế tối đa sai sót
                                </Text>
                            </div>
                        </Group>

                        <Divider my="sm" />

                        {/* HƯỚNG DẪN */}
                        <Text fw={600} mb="xs">
                            📘 Hướng dẫn nạp linh thạch
                        </Text>
                        <ol className="list-decimal list-inside space-y-2 text-sm dark:text-gray-300 mb-4">
                            <li>Nhập số tiền muốn nạp (tối thiểu 1.000 VNĐ)</li>
                            <li>
                                Nhấn <b>Thanh toán</b> để tạo mã QR
                            </li>
                            <li>Dùng ứng dụng ngân hàng hoặc ví điện tử quét mã QR</li>
                            <li>Hoàn tất thanh toán và chờ hệ thống xác nhận</li>
                            <li>Linh thạch sẽ được cộng tự động vào tài khoản</li>
                        </ol>
                        <Text size="sm" opacity={0.9}>
                            Tỉ lệ quy đổi: <b>1000 VNĐ = 1000 linh thạch</b>
                        </Text>
                    </div>

                    <NumberInput
                        label="Số tiền muốn thanh toán (VNĐ)"
                        placeholder="Nhập tối thiểu 1.000"
                        value={amount || 0}
                        onChange={(value) => setAmount(Number(value))}
                        min={MIN_AMOUNT}
                        step={1000}
                        thousandSeparator=","
                        error={
                            amount !== null && amount < MIN_AMOUNT
                                ? "Số tiền tối thiểu là 1.000 VNĐ"
                                : null
                        }
                    />

                    <Group justify="space-between" mt="md">
                        <div>
                            <Text size="sm" c="dimmed">
                                Bạn sẽ nhận được
                            </Text>
                            <Text size="lg" fw={700} c="blue">
                                {stones.toLocaleString()} linh thạch
                            </Text>
                        </div>

                        <Badge color="blue" variant="light">
                            Tự động
                        </Badge>
                    </Group>

                    <Button
                        fullWidth
                        size="md"
                        mt="lg"
                        radius="md"
                        disabled={!amount || amount < MIN_AMOUNT}
                        onClick={handlePurchase}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Thanh toán
                    </Button>
                </Card>
                <Card shadow="sm" radius="lg" mt="md" padding="lg">
                    {/* GỢI Ý GÓI */}
                    <Text fw={600} mb="xs">
                        ⭐ Gợi ý gói thành viên
                    </Text>
                    <Text size="sm" c="dimmed" mb="md">
                        Nạp nhiều linh thạch giúp bạn mở khoá các đặc quyền như: đọc chương VIP,
                        giảm giá khi mua truyện, ưu tiên truy cập nội dung mới và nhiều quyền lợi
                        khác trong tương lai.
                    </Text>

                    {/* LƯU Ý */}
                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3">
                        <Text fw={600} c="yellow" mb="xs">
                            ⚠️ Lưu ý quan trọng
                        </Text>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            <li>Không đóng trang hoặc reload khi đang thanh toán</li>
                            <li>Chỉ quét mã QR được tạo trong phiên hiện tại</li>
                            <li>
                                Nếu sau khi thanh toán mà chưa nhận được linh thạch, vui lòng liên
                                hệ hỗ trợ và cung cấp <b>mã giao dịch</b>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>

            {/* MODAL PAYMENT */}
            <Modal
                opened={opened}
                onClose={() => setConfirmClose(true)}
                title="📌 Quét mã để thanh toán"
                centered
                radius="lg"
                closeOnClickOutside={false}
                closeOnEscape={false}
                onExitTransitionEnd={() => {
                    setPurchaseSuccess(false);
                    setAmount(null);
                    setAppTransId(null);
                }}
            >
                <div className="flex flex-col items-center gap-4">
                    {purchaseSuccess ? (
                        <>
                            <img
                                src="https://i.pinimg.com/originals/90/13/f7/9013f7b5eb6db0f41f4fd51d989491e7.gif"
                                alt="success"
                                className="w-40"
                            />
                            <Text size="sm" ta="center">
                                Thanh toán thành công. Tự động đóng sau{" "}
                                <Text span fw={600} c="green">
                                    {countdown}s
                                </Text>
                            </Text>

                            <Button variant="light" onClick={resetAndClose}>
                                Đóng ngay
                            </Button>
                        </>
                    ) : isPending ? (
                        <Skeleton height={200} width={200} radius="md" />
                    ) : (
                        <>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data?.qr_code}`}
                                alt="QR thanh toán"
                                className="rounded-lg border"
                            />
                            {data?.qr_code ? (
                                <Text>QR code có hiệu lực trong 15 phút.</Text>
                            ) : (
                                <Text>Đã có lỗi xảy ra trong quá trình tạo QR code.</Text>
                            )}
                        </>
                    )}

                    <Divider className="w-full" />

                    <div className="w-full text-sm space-y-2">
                        <InfoRow label="Số tiền" value={`${amount?.toLocaleString()} VNĐ`} />
                        <InfoRow
                            label="Nhận được"
                            value={`${stones.toLocaleString()} linh thạch`}
                        />
                        <InfoRow label="Mã giao dịch" value={data?.orderCode || "-"} mono />
                        <InfoRow label="Nội dung CK" value={transactionCode} mono highlight />
                    </div>

                    {!purchaseSuccess && (
                        <Text size="xs" ta="center" c="dimmed">
                            Vui lòng không đóng trang trong quá trình thanh toán.
                        </Text>
                    )}
                </div>
            </Modal>

            {/* MODAL CONFIRM CLOSE */}
            <Modal
                opened={confirmClose}
                onClose={() => setConfirmClose(false)}
                title="⚠️ Huỷ thanh toán?"
                centered
                radius="md"
            >
                <Text size="sm" mb="md">
                    Bạn có chắc chắn muốn huỷ quá trình thanh toán này không?
                </Text>

                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setConfirmClose(false)}>
                        Quay lại
                    </Button>
                    <Button color="red" onClick={resetAndClose}>
                        Huỷ thanh toán
                    </Button>
                </Group>
            </Modal>

            {/* MODAL REQUIRE lOGIN */}
            <RequireLoginModal
                opened={loginNotice}
                onClose={() => {
                    setLoginNotice(false);
                }}
                title="Phiên đăng nhập đã hết hạn."
                message="Bạn vui lòng đăng nhập lại để thực hiện chức năng này."
            />
        </>
    );
};

const InfoRow = ({
    label,
    value,
    mono,
    highlight,
}: {
    label: string;
    value: string;
    mono?: boolean;
    highlight?: boolean;
}) => (
    <div className="flex justify-between">
        <span className="text-gray-500">{label}</span>
        <span
            className={`font-semibold ${mono ? "font-mono" : ""} ${
                highlight ? "text-blue-600" : ""
            }`}
        >
            {value}
        </span>
    </div>
);

export default BuyStonePage;
