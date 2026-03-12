import { Group, Image, Pagination, Stack, Table, Text } from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useCommentHistory } from "../../hooks/useHistory";
import { DateHourFormat } from "../../utils";

export interface ICommentHistoryItem {
    id: string;
    content: string;
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

const CommenHistoryTab = () => {
    const navigate = useNavigate();

    const [searchParam, setSearchParam] = useSearchParams();

    const page = Number(searchParam.get("page")) || 1;
    const LIMIT = Number(searchParam.get("limit")) || 10;

    const { isLoggedIn } = useUserStore();

    const { data: commentHistoryData, isLoading } = useCommentHistory(page, LIMIT);

    const { history: commentHistory, total } =
        commentHistoryData || { history: [], total: 0 };

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
                                    <Table.Th w="30%">Truyện</Table.Th>
                                    <Table.Th w="15%">Chương số</Table.Th>
                                    <Table.Th w="35%">Nội dung</Table.Th>
                                    <Table.Th w="20%">Thời gian</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {commentHistory?.length > 0 ? (
                                    commentHistory.map((c: ICommentHistoryItem) => (
                                        <Table.Tr key={c.id}>
                                            <Table.Td>
                                                <Group
                                                    wrap="nowrap"
                                                    className="hover:cursor-pointer hover:text-blue-500"
                                                    onClick={() =>
                                                        navigate(`/story/${c.chapterId.storyId.slug}`)
                                                    }
                                                >
                                                    <Image
                                                        src={c.chapterId.storyId.image}
                                                        alt={c.chapterId.storyId.title}
                                                        w={50}
                                                        mah={60}
                                                    />
                                                    <span className="line-clamp-2">
                                                        {c.chapterId.storyId.title}
                                                    </span>
                                                </Group>
                                            </Table.Td>

                                            <Table.Td>
                                                <Text
                                                    size="sm"
                                                    className="hover:cursor-pointer hover:underline hover:text-blue-600"
                                                    onClick={() =>
                                                        navigate(
                                                            `/truyen/${c.chapterId.storyId.slug}/chuong/${c.chapterId.chapterNumber}`
                                                        )
                                                    }
                                                >
                                                    {`Chương ${c.chapterId.chapterNumber}`}
                                                </Text>
                                            </Table.Td>

                                            <Table.Td className="line-clamp-2">
                                                {c.content}
                                            </Table.Td>

                                            <Table.Td>
                                                {DateHourFormat(c.createdAt)}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                ) : page === 1 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={4} className="text-center">
                                            <Text size="md" fw={600} mt={12}>
                                                Không có lịch sử bình luận
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan={4} className="text-center">
                                            <Text size="md" fw={600} mt={12}>
                                                Đã hiển thị toàn bộ dữ liệu ở các trang trước
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
                                Bạn cần đăng nhập để xem lịch sử bình luận truyện
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

export default CommenHistoryTab;