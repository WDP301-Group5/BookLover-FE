import { Badge, Pagination, Stack, Table, Text } from "@mantine/core";
import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useRechargeHistory } from "../../hooks/useHistory";
import { DateHourFormat } from "../../utils";

export interface IStoneRechargeHistoryItem {
    id: string;
    quantity: number;
    money: number;
    stoneBefore: number;
    stoneAfter: number;
    status: "success" | "failed" | "pending";
    orderCode: string;
    createdAt: Date;
}

const StoneRechargeHistoryTab = () => {
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { isLoggedIn } = useUserStore();

    const { data: rechargeData, isLoading } = useRechargeHistory(page, LIMIT);

    const { history: rechargeHistory, total } = rechargeData || {
        history: [],
        total: 0,
    };

    const totalPage = Math.ceil(total / LIMIT);

    const renderStatus = (status: string) => {
        switch (status) {
            case "success":
                return <Badge color="green">Thành công</Badge>;
            case "failed":
                return <Badge color="red">Thất bại</Badge>;
            default:
                return <Badge color="yellow">Đang xử lý</Badge>;
        }
    };

    return (
        <Stack>
            <Table style={{ tableLayout: "fixed", width: "100%" }}>
                {isLoggedIn ? (
                    isLoading ? (
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td colSpan={5} className="text-center">
                                    Đang tải...
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    ) : (
                        <>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w="25%">Mã giao dịch</Table.Th>
                                    <Table.Th w="15%">Số tiền</Table.Th>
                                    <Table.Th w="20%">Linh thạch nhận</Table.Th>
                                    <Table.Th w="20%">Trạng thái</Table.Th>
                                    <Table.Th w="20%">Thời gian</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {rechargeHistory?.length > 0 ? (rechargeHistory?.map((r: IStoneRechargeHistoryItem) => (
                                    <Table.Tr key={r.id}>

                                        <Table.Td className="truncate">
                                            {r.orderCode}
                                        </Table.Td>

                                        <Table.Td>
                                            {r.money.toLocaleString()}đ
                                        </Table.Td>

                                        <Table.Td>
                                            <Text fw={500}>💎 {r.quantity}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            {renderStatus(r.status)}
                                        </Table.Td>


                                        <Table.Td>
                                            {DateHourFormat(r.createdAt)}
                                        </Table.Td>
                                    </Table.Tr>
                                ))): (
                                    <Table.Tr>
                                        <Table.Td colSpan={5} className="text-center">
                                            <Text size="md" mt={12} fw={600} >
                                            Không có lịch sử nạp linh thạch của người dùng
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </>
                    )
                ) : (
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td colSpan={5} className="text-center">
                                Bạn cần đăng nhập để xem lịch sử nạp linh thạch
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                )}
            </Table>

            <Pagination total={totalPage} value={page} onChange={setPage} mt={12} mx="auto" />
        </Stack>
    );
};

export default StoneRechargeHistoryTab;