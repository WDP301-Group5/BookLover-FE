import { useEffect, useState } from "react";
import {
    Tabs,
    Card,
    Text,
    Group,
    SimpleGrid,
    Table,
    NumberInput,
    TextInput,
    Button,
    Select,
    Pagination,
    Badge,
    Alert,
    Paper,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCoin, IconBook, IconShoppingCart, IconWallet, IconAlertCircle } from "@tabler/icons-react";
import "dayjs/locale/vi";
import dayjs from "dayjs";
import { useUserStore } from "../../../stores/useUserStore";
import { useAllPremiumStory, useChaptersRevenue, useGeneralRevenue, useWithdrawHistory } from "../../../hooks/useRevenue";
import RevenueService from "../../../services/RevenueService";
import { showError, showSuccess } from "../../../utils/notifications";

const convertFromDate = (from: Date | null) => {
    return from ? dayjs(from).startOf("day").toISOString() : null;
}

const convertToDate = (to: Date | null) => {
    return to ? dayjs(to).endOf("day").toISOString() : null;
}

interface ChapterRevenue {
    _id: string;
    chapter: {
        _id: string;
        chapterNumber: number;
        price: number;
    }
    story: {
        _id: string;
        title: string;
        slug: string;
    };
    totalPurchases: number;
    totalRevenue: number;
}

interface StoryItem {
    id: string;
    title: string;
    slug: string;
}

interface WithdrawItem {
    _id: string;
    phoneNumber: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const LIMIT = 20;

const formatMoney = (money: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(money);

const BadgeStatus = ({ status }: { status: string }) => {
    const listStatus: Record<string, { color: string; label: string }> = {
        "pending": { color: "yellow", label: "Chờ duyệt" },
        "success": { color: "green", label: "Thành công" },
        "failed": { color: "red", label: "Thất bại" },
        "cancelled": { color: "gray", label: "Hủy" },
    };
    return (
        <Badge size="xs" color={listStatus[status].color || "gray"}>
            {listStatus[status].label}
        </Badge>
    )
}

const RevenueTab = () => {
    const { isLoggedIn } = useUserStore();
    const [withdrawAmount, setWithdrawAmount] = useState(10000);
    const [phone, setPhone] = useState("");
    const [rangeOfChapters, setRangeOfChapters] = useState<[Date | null, Date | null]>([null, null]);
    const [from, to] = rangeOfChapters;
    const [storyId, setStoryId] = useState<string | null>("");
    const [searchOfChapters, setSearchOfChapters] = useState<{ storyId: string; from: string | null; to: string | null; }>({
        storyId: "",
        from: null,
        to: null,
    });
    const [searchOfWithdraw, setSearchOfWithdraw] = useState<[Date | null, Date | null]>([null, null]);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<{ phoneNumber: string; amount: string; }>({ phoneNumber: "", amount: "" });
    const [sendWithdrawLoading, setSendWithdrawLoading] = useState(false);

    // Get Data
    const { data: generalInfor } = useGeneralRevenue(isLoggedIn);
    const { data: chaptersRevenueData, isLoading: isLoadingChaptersRevenue } = useChaptersRevenue(
        isLoggedIn,
        page,
        LIMIT,
        searchOfChapters?.storyId || "",
        searchOfChapters?.from || null,
        searchOfChapters?.to || null,
    );
    const { data: withdrawHistory } = useWithdrawHistory(isLoggedIn, searchOfWithdraw[0] ? convertFromDate(searchOfWithdraw[0]) : null, searchOfWithdraw[1] ? convertToDate(searchOfWithdraw[1]) : null);

    const chaptersRevenue = chaptersRevenueData?.transactions || [];
    const totalPage = Math.ceil(chaptersRevenueData?.total / LIMIT || 1);

    const canWithdraw = withdrawAmount >= 10000 && withdrawAmount <= (Number(generalInfor?.totalRevenue) - Number(generalInfor?.totalWithdrawAmount));

    const { data: allPremiumStory } = useAllPremiumStory();

    const handleResetSearchOfChapters = () => {
        setSearchOfChapters({ storyId: "", from: null, to: null });
    }

    const handleSearchOfChapters = () => {
        setSearchOfChapters({
            storyId: storyId || "",
            from: from ? convertFromDate(from) : null,
            to: to ? convertToDate(to) : null,
        });
    }

    const handleResetSearchOfWithdraw = () => {
        setSearchOfWithdraw([null, null]);
    }

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!generalInfor) return;

        const newBalance =
            Number(generalInfor.totalRevenue || 0) -
            Number(generalInfor.totalWithdrawAmount || 0);

        setBalance(newBalance);
    }, [generalInfor]);

    const handleRequestWithdraw = async () => {
        // reset error
        setError({ phoneNumber: "", amount: "" });

        let hasError = false;

        const isValidPhone = /^0\d{9}$/.test(phone);

        if (!isValidPhone) {
            setError(prev => ({
                ...prev,
                phoneNumber: "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số",
            }));
            hasError = true;
        }

        const availableBalance =
            Number(generalInfor?.totalRevenue || 0) -
            Number(generalInfor?.totalWithdrawAmount || 0);

        const amount = Number(withdrawAmount);

        if (!withdrawAmount || isNaN(amount)) {
            setError(prev => ({
                ...prev,
                amount: "Số tiền không hợp lệ",
            }));
            hasError = true;
        } else if (amount < 10000) {
            setError(prev => ({
                ...prev,
                amount: "Số tiền tối thiểu là 10,000 VND",
            }));
            hasError = true;
        } else if (amount > availableBalance) {
            setError(prev => ({
                ...prev,
                amount: "Số tiền vượt quá số dư khả dụng",
            }));
            hasError = true;
        }

        if (hasError) return;

        setSendWithdrawLoading(true);

        const sendRequest = await RevenueService.requestWithdraw(phone, amount);
        if (sendRequest) {
            showSuccess("Gửi yêu cầu rút tiền thành công");
            withdrawHistory.unshift(sendRequest);
            setBalance(balance - amount);
            setWithdrawAmount(10000);
            setPhone("");
        } else {
            showError("Gửi yêu cầu rút tiền không thành công. Vui lòng thủ lại sau.");
        }
        setSendWithdrawLoading(false);
    };

    return (
        <Tabs defaultValue="overview">
            <Tabs.List>
                <Tabs.Tab value="overview">Tổng quan</Tabs.Tab>
                <Tabs.Tab value="chapters">Chương trả phí</Tabs.Tab>
                <Tabs.Tab value="withdraw-history">Lịch sử rút</Tabs.Tab>
                <Tabs.Tab value="withdraw">Rút tiền</Tabs.Tab>
            </Tabs.List>

            {/* TAB 1 */}
            <Tabs.Panel value="overview" pt="md">
                <SimpleGrid cols={2}>
                    <Card shadow="sm" p="lg">
                        <Group>
                            <IconBook />
                            <Text>Số Chương Premium</Text>
                        </Group>
                        <Text size="xl" fw={700}>{generalInfor?.totalChapters || 0}</Text>
                    </Card>

                    <Card shadow="sm" p="lg">
                        <Group>
                            <IconShoppingCart />
                            <Text>Lượt mua</Text>
                        </Group>
                        <Text size="xl" fw={700}>{generalInfor?.totalPurchases || 0}</Text>
                    </Card>

                    <Card shadow="sm" p="lg">
                        <Group>
                            <IconCoin />
                            <Text>Doanh thu nhận</Text>
                        </Group>
                        <Text size="xl" fw={700}>{formatMoney(generalInfor?.totalRevenue || 0)}</Text>
                    </Card>

                    <Card shadow="sm" p="lg">
                        <Group>
                            <IconWallet />
                            <Text>Đã rút</Text>
                        </Group>
                        <Text size="xl" fw={700}>{formatMoney(generalInfor?.totalWithdrawAmount || 0)}</Text>
                    </Card>

                    <Card shadow="sm" p="lg">
                        <Group>
                            <IconWallet />
                            <Text>Số dư</Text>
                        </Group>
                        <Text size="xl" fw={700}>{formatMoney(balance)}</Text>
                    </Card>
                </SimpleGrid>
            </Tabs.Panel>

            {/* TAB 2 */}
            <Tabs.Panel value="chapters" pt="md">
                <Group mb="md">
                    <Select w={200}
                        placeholder="Chọn truyện"
                        data={[{ value: "", label: "Tất cả" }, ...(allPremiumStory || []).map((item: StoryItem) => ({ value: item.id, label: item.title }))]}
                        onChange={setStoryId}
                        value={storyId}
                        allowDeselect={false}
                    />
                    <DatePickerInput
                        locale="vi"
                        miw={100}
                        type="range"
                        valueFormat="DD/MM/YYYY"
                        placeholder="Khoảng thời gian"
                        value={rangeOfChapters}
                        onChange={setRangeOfChapters}
                    />
                    <Button onClick={handleSearchOfChapters}>Tìm</Button>
                    <Button onClick={handleResetSearchOfChapters} >Reset</Button>
                </Group>

                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Truyện</Table.Th>
                            <Table.Th>Chương</Table.Th>
                            <Table.Th>Giá hiện tại</Table.Th>
                            <Table.Th>Lượt mua</Table.Th>
                            <Table.Th>Doanh thu</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {!isLoadingChaptersRevenue && chaptersRevenue?.map((item: ChapterRevenue) => (
                            <Table.Tr key={item._id}>
                                <Table.Td className="max-w-60" >{item?.story?.title}</Table.Td>
                                <Table.Td>Chương {item.chapter.chapterNumber}</Table.Td>
                                <Table.Td>{item.chapter.price} 💎</Table.Td>
                                <Table.Td>{item.totalPurchases || 0}</Table.Td>
                                <Table.Td>{formatMoney(Number(item.totalRevenue) * 1000 || 0)}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <div className="flex justify-center mt-6">
                    <Pagination className="flex mx-auto" total={totalPage} value={page} onChange={setPage} mt="md" />
                </div>
            </Tabs.Panel>

            {/* TAB 3 */}
            <Tabs.Panel value="withdraw-history" pt="md">
                <Group mb="md">
                    <DatePickerInput locale="vi"
                        miw={250}
                        type="range"
                        valueFormat="DD/MM/YYYY"
                        placeholder="Khoảng thời gian"
                        value={searchOfWithdraw}
                        onChange={setSearchOfWithdraw}
                    />
                    <Button onClick={handleResetSearchOfWithdraw} >Reset</Button>
                </Group>

                <Table striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Số điện thoại</Table.Th>
                            <Table.Th>Số tiền</Table.Th>
                            <Table.Th>Trạng thái</Table.Th>
                            <Table.Th>Thời gian</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {(withdrawHistory && withdrawHistory.length > 0) ? withdrawHistory?.map((item: WithdrawItem) => (
                            <Table.Tr key={item._id}>
                                <Table.Td>{item.phoneNumber}</Table.Td>
                                <Table.Td>{formatMoney(item.amount)}</Table.Td>
                                <Table.Td>
                                    <BadgeStatus status={item.status} />
                                </Table.Td>
                                <Table.Td>{dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}</Table.Td>
                            </Table.Tr>
                        )) : (
                            <Table.Tr>
                                <Table.Td colSpan={4} className="text-center">Không có dữ liệu</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Tabs.Panel>

            {/* TAB 4 */}
            <Tabs.Panel value="withdraw" pt="md">
                <Alert icon={<IconAlertCircle />} color="blue" mb="md" >
                    <li className="text-[16px] font-medium" >
                        <ul>
                            - Số dư tối thiểu để rút: 10,000đ
                        </ul>
                        <ul>
                            - Yêu cầu sẽ được xử lý trong vòng 24h
                        </ul>
                        <ul>
                            - Hiện tại chỉ hỗ trợ ZaloPay Sandbox
                        </ul>
                    </li>
                </Alert>

                <Paper p="md" my="md" withBorder radius="md">
                    <Group>
                        <IconWallet />
                        <Text fw={500}>Số dư khả dụng của bạn</Text>
                    </Group>
                    <Text size="xl" fw={600}>{formatMoney((Number(generalInfor?.totalRevenue) - Number(generalInfor?.totalWithdrawAmount)) || 0)}</Text>
                </Paper>

                <Card p="lg">
                    <TextInput
                        label="Số điện thoại ZaloPay"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        error={error.phoneNumber.length > 0 && error.phoneNumber}
                    />

                    <NumberInput
                        label="Số tiền muốn rút"
                        placeholder="Nhập số tiền"
                        mt="md"
                        value={withdrawAmount}
                        onChange={(val) => setWithdrawAmount(Number(val))}
                        min={10000}
                        max={balance}
                        step={1000}
                        error={error.amount.length > 0 && error.amount}
                    />

                    {!canWithdraw && (
                        <Text c="red" size="sm" mt="sm">
                            Số tiền phải lớn hơn hoặc bằng 10,000 vnđ và nhỏ hơn hoặc bằng số dư
                        </Text>
                    )}

                    <Button mt="md" disabled={!canWithdraw || sendWithdrawLoading || !phone || !withdrawAmount}
                        loading={sendWithdrawLoading} fullWidth onClick={handleRequestWithdraw} >
                        Gửi yêu cầu rút tiền
                    </Button>
                </Card>
            </Tabs.Panel>
        </Tabs>
    );
}

export default RevenueTab;
