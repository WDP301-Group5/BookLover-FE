import { Group, Image, Pagination, Stack, Table, Text } from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { usePurchaseHistory } from "../../hooks/useHistory";
import { DateHourFormat } from "../../utils";

export interface IPurchaseHistoryItem {
    id: string;
    spiritStones: number;
    createdAt: Date;
    chapterId: {
        _id: string;
        chapterNumber: number;
        storyId: {
            _id: string;
            title: string;
            slug: string;
            image: string;
        };
    };
}

const PurchaseHistoryTab = () => {

    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useSearchParams();
    const page = Number(searchParam.get("page")) || 1;
    const LIMIT = Number(searchParam.get("limit")) || 10;

    const { isLoggedIn } = useUserStore();

    const { data: purchaseHistoryData, isLoading } = usePurchaseHistory(
        page,
        LIMIT
    );

    const { history: purchaseHistory, total } =
        purchaseHistoryData || { history: [], total: 0 };

    const totalPage = Math.ceil(total / LIMIT);

    const handleChangePage = (page: number) => {
        searchParam.set("page", page.toString());
        setSearchParam(searchParam);
    };

    return (
        <Stack>
            <Table style={{ tableLayout: "fixed", width: "100%" }}>
                {isLoggedIn ? (
                    isLoading ? (
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td colSpan={4} className="text-center">
                                    Đang tải...
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    ) : (
                        <>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w="35%">Truyện</Table.Th>
                                    <Table.Th w="20%">Chương số</Table.Th>
                                    <Table.Th w="20%">Giá truyện</Table.Th>
                                    <Table.Th w="25%">Thời gian</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {purchaseHistory?.length > 0 ? (purchaseHistory?.map((p: IPurchaseHistoryItem) => (
                                    <Table.Tr key={p.id}>
                                        {/* Story */}
                                        <Table.Td>
                                            <Group
                                                wrap="nowrap"
                                                className="cursor-pointer hover:text-blue-500"
                                                onClick={() =>
                                                    navigate(`/story/${p.chapterId.storyId.slug}`)
                                                }
                                            >
                                                <Image
                                                    src={p.chapterId.storyId.image}
                                                    alt={p.chapterId.storyId.title}
                                                    w={50}
                                                    mah={60}
                                                />

                                                <span className="line-clamp-2">
                                                    {p.chapterId.storyId.title}
                                                </span>
                                            </Group>
                                        </Table.Td>

                                        {/* Chapter */}
                                        <Table.Td>
                                            <Text
                                                size="sm"
                                                className="cursor-pointer hover:underline hover:text-blue-600"
                                                onClick={() =>
                                                    navigate(
                                                        `/truyen/${p.chapterId.storyId.slug}/chuong/${p.chapterId.chapterNumber}`
                                                    )
                                                }
                                            >
                                                {`Chương ${p.chapterId.chapterNumber}`}
                                            </Text>
                                        </Table.Td>

                                        {/* Price */}
                                        <Table.Td>
                                            <Text fw={500}>{p.spiritStones} 💎</Text>
                                        </Table.Td>

                                        {/* Time */}
                                        <Table.Td>
                                            {DateHourFormat(p.createdAt)}
                                        </Table.Td>
                                    </Table.Tr>
                                ))) : (
                                    page === 1 ? (
                                        <Table.Tr>
                                            <Table.Td colSpan={4} className="text-center">
                                                <Text size="md" fw={600} mt={12} >
                                                    Không có lịch sử mua chương truyện của người dùng
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={4} className="text-center">
                                                <Text size="md" fw={600} mt={12} >
                                                    Đã hiển thị toàn bộ dữ liệu ở các trang trước
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    )
                                )}
                            </Table.Tbody>
                        </>
                    )
                ) : (
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td colSpan={4} className="text-center">
                                Bạn cần đăng nhập để xem lịch sử mua chương
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                )}
            </Table>

            <Pagination
                total={totalPage}
                value={page}
                onChange={(value: number) => handleChangePage(value)}
                mt={12}
                mx="auto"
            />
        </Stack>
    );
};

export default PurchaseHistoryTab;