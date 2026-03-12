import { Group, Image, Pagination, Stack, Table, Rating, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useReviewHistory } from "../../hooks/useHistory";
import { DateHourFormat } from "../../utils";

export interface IReviewHistoryItem {// TODO: check lại review
    id: string;
    rating: number;
    content: string;
    createdAt: Date;
    storyId: {
        _id: string;
        title: string;
        slug: string;
        image: string;
    };
}

const ReviewHistoryTab = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const LIMIT = 10;

    const { isLoggedIn } = useUserStore();

    const { data: reviewHistoryData, isLoading } = useReviewHistory(page, LIMIT);

    const { history: reviewHistory, total } = reviewHistoryData || { history: [], total: 0 };

    const totalPage = Math.ceil(total / LIMIT);

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
                                    <Table.Th w="30%">Truyện</Table.Th>
                                    <Table.Th w="15%">Đánh giá</Table.Th>
                                    <Table.Th w="35%">Nội dung</Table.Th>
                                    <Table.Th w="20%">Thời gian</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {reviewHistory?.lenght > 0 ? (reviewHistory?.map((r: IReviewHistoryItem) => (
                                    <Table.Tr key={r.id}>
                                        <Table.Td>
                                            <Group
                                                wrap="nowrap"
                                                className="hover:cursor-pointer hover:text-blue-500"
                                                onClick={() => navigate(`/story/${r.storyId.slug}`)}
                                            >
                                                <Image
                                                    src={r.storyId.image}
                                                    alt={r.storyId.title}
                                                    w={50}
                                                    mah={60}
                                                />

                                                <span className="line-clamp-2">
                                                    {r.storyId.title}
                                                </span>
                                            </Group>
                                        </Table.Td>

                                        <Table.Td>
                                            <Rating value={r.rating} readOnly size="sm" />
                                        </Table.Td>

                                        <Table.Td className="line-clamp-2">
                                            {r.content}
                                        </Table.Td>

                                        <Table.Td>
                                            {DateHourFormat(r.createdAt)}
                                        </Table.Td>
                                    </Table.Tr>
                                ))) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={4} className="text-center">
                                            <Text size="md" fw={600} mt={12}>
                                                Không có lịch sử đánh giá truyện của người dùng
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
                            <Table.Td colSpan={4} className="text-center">
                                Bạn cần đăng nhập để xem lịch sử đánh giá truyện
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                )}
            </Table>

            <Pagination
                total={totalPage}
                value={page}
                onChange={setPage}
                mt={12}
                mx={"auto"}
            />
        </Stack>
    );
};

export default ReviewHistoryTab;