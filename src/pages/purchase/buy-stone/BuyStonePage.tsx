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
const MIN_AMOUNT = 10000;

const BuyStonePage = () => {
  /* =======================
   * STATE
   ======================= */

  const [amount, setAmount] = useState<number | null>(null);
  const stones = amount ? (amount * RATE) / 1000 : 0;

  const [opened, setOpened] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [loginNotice, setLoginNotice] = useState(false);

  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const { isLoggedIn: isUserLoggedIn, logout } = useUserStore();

  const [appTransId, setAppTransId] = useState<string | null>(null);

  const { mutate, isPending, data } = useCreateOrder();

  /* =======================
   * VALIDATION
   ======================= */

  const isValidAmount =
    amount !== null && amount >= MIN_AMOUNT && amount % 1000 === 0;

  /* =======================
   * TRANSACTION CODE
   ======================= */

  const transactionCode = useMemo(() => {
    return `NAP-LINH-THACH_${Date.now()}`;
  }, []);

  /* =======================
   * EFFECTS
   ======================= */

  useEffect(() => {
    if (data?.status === 401) {
      setOpened(false);
      setLoginNotice(true);
      logout();
      return;
    }

    if (data?.app_trans_id) {
      setAppTransId(data.app_trans_id);
    }
  }, [data, logout]);

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
    if (!isValidAmount) return;

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

        {/* HEADER */}
        <Card shadow="md" radius="lg" p="lg">

          <div className="rounded-xl p-6 mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <Text size="xl" fw={800}>
              💎 Nạp linh thạch
            </Text>

            <Text size="sm" mt={4} opacity={0.9}>
              Nạp linh thạch để mở khóa chương VIP và ủng hộ tác giả.
            </Text>

            <Group mt="md">
              <Badge color="white" variant="light">🔒 An toàn</Badge>
              <Badge color="white" variant="light">⚡ Tự động</Badge>
              <Badge color="white" variant="light">🎯 Chính xác</Badge>
            </Group>
          </div>

          {/* QUICK AMOUNT */}
          <Group mb="md">
            <Button variant="light" onClick={() => setAmount(10000)}>10K</Button>
            <Button variant="light" onClick={() => setAmount(20000)}>20K</Button>
            <Button variant="light" onClick={() => setAmount(50000)}>50K</Button>
            <Button variant="light" onClick={() => setAmount(100000)}>100K</Button>
          </Group>

          {/* INPUT */}
          <Card withBorder radius="md" p="md">

            <NumberInput
              label="Số tiền muốn nạp"
              description="Tối thiểu 10.000 VNĐ"
              placeholder="Ví dụ: 10,000"
              value={amount || ""}
              onChange={(value) => setAmount(Number(value))}
              min={MIN_AMOUNT}
              step={1000}
              thousandSeparator=","
              error={
                amount !== null && amount % 1000 !== 0
                  ? "Số tiền phải là bội số của 1.000 VNĐ"
                  : null
              }
            />

            <Divider my="md" />

            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Bạn sẽ nhận
              </Text>

              <Text size="xl" fw={800} c="blue">
                💎 {Math.floor(stones).toLocaleString()}
              </Text>
            </Group>

          </Card>

          {/* BUTTON */}
          <Button
            fullWidth
            size="lg"
            mt="lg"
            radius="md"
            disabled={!isValidAmount}
            onClick={handlePurchase}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            💳 Thanh toán ngay
          </Button>

        </Card>

        {/* NOTE */}
        <Card shadow="sm" radius="lg" mt="md" p="lg">
          <Text fw={600} mb="xs">⚠️ Lưu ý</Text>

          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Không reload trang khi đang thanh toán</li>
            <li>QR chỉ có hiệu lực trong phiên hiện tại</li>
            <li>Nếu thanh toán xong chưa nhận linh thạch hãy liên hệ hỗ trợ</li>
          </ul>

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
      >
        <div className="flex flex-col items-center gap-5">

          {purchaseSuccess ? (
            <>
              <img
                src="https://i.pinimg.com/originals/90/13/f7/9013f7b5eb6db0f41f4fd51d989491e7.gif"
                className="w-36"
              />

              <Text fw={600} size="lg" c="green">
                Thanh toán thành công 🎉
              </Text>

              <Text size="sm">
                Tự động đóng sau <b>{countdown}s</b>
              </Text>

              <Button variant="light" onClick={resetAndClose}>
                Đóng ngay
              </Button>
            </>
          ) : isPending ? (
            <Skeleton height={220} width={220} radius="md" />
          ) : (
            <>
              <Card withBorder radius="md" p="md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data?.qr_code}`}
                  alt="QR thanh toán"
                />
              </Card>

              <Text size="sm" c="dimmed">
                Quét QR bằng ứng dụng ngân hàng
              </Text>
            </>
          )}

          <Divider className="w-full" />

          <div className="w-full text-sm space-y-3 border rounded-md p-4 bg-gray-50">

            <InfoRow label="Số tiền" value={`${amount?.toLocaleString()} VNĐ`} />
            <InfoRow label="Nhận được" value={`💎 ${stones.toLocaleString()}`} />

            <Divider />

            <InfoRow label="Mã giao dịch" value={data?.orderCode || "-"} mono />

            <InfoRow
              label="Nội dung CK"
              value={transactionCode}
              mono
              highlight
            />

          </div>

          {!purchaseSuccess && (
            <Text size="xs" ta="center" c="dimmed">
              Vui lòng không đóng trang trong quá trình thanh toán.
            </Text>
          )}

        </div>
      </Modal>

      {/* CONFIRM CLOSE */}
      <Modal
        opened={confirmClose}
        onClose={() => setConfirmClose(false)}
        title="⚠️ Huỷ thanh toán?"
        centered
      >
        <Text size="sm" mb="md">
          Bạn có chắc muốn huỷ thanh toán không?
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

      {/* LOGIN */}
      <RequireLoginModal
        opened={loginNotice}
        onClose={() => setLoginNotice(false)}
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