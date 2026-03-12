import { Card, Group, Image, Pagination, Stack, Text } from "@mantine/core";
import { useUserStore } from "../../stores/useUserStore";
import { useReadingHistory } from "../../hooks/useHistory";
import type { Story } from "../../interfaces/Story";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";
import HistoryService from "../../services/HistoryService";
import { showSuccess } from "../../utils/notifications";
import { useQueryClient } from "@tanstack/react-query";

export interface IReadingHistory {
    id: string;
    userId: string;
    story: Story;
    chapterNumber: number;
    createdAt?: Date;
    updatedAt: Date;
}

const ReadingHistoryTab = () => {

    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const LIMIT = 10;
    const { isLoggedIn } = useUserStore();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: readingHistoryData, isLoading } = useReadingHistory(page, LIMIT);
    const { history: readingHistory, total } = readingHistoryData || { readingHistory: [], total: 0 };

    const totalPage = Math.ceil(total / LIMIT);

    const handleDelete = async (id: string) => {
        if (!id) return;
        setLoading(true);
        const result = await HistoryService.deleteHistory(id);
        if (result && result?.success) {
            await queryClient.invalidateQueries({ queryKey: ["readingHistory", page, LIMIT] });
            showSuccess("Xóa lịch sử thành công");
        };
        setLoading(false);
    };

    return (
        <Stack>
            {isLoggedIn && (isLoading ? (<Text>Đang tải...</Text>) : (
                readingHistory && readingHistory.length ? (
                    <>
                        {readingHistory?.map((item: IReadingHistory) => (
                            <Card key={item.id} shadow="sm">
                                <Group>
                                    <Image
                                        src={item.story.image}
                                        w={60}
                                        mah={80}
                                        radius="sm"
                                    />

                                    <div className="flex flex-col gap-4">
                                        <Text
                                            fw={600}
                                            onClick={() => navigate(`/story/${item.story.slug}`)}
                                            className="hover:underline cursor-pointer hover:text-blue-600"
                                        >
                                            {item.story.title}
                                        </Text>

                                        <Text size="sm">
                                            Đọc tiếp:{" "}
                                            <span
                                                className="cursor-pointer underline hover:text-blue-600"
                                                onClick={() => navigate(`/truyen/${item.story.slug}/chuong/${item.chapterNumber}`)}
                                            >
                                                Chương {item.chapterNumber}
                                            </span>
                                        </Text>
                                    </div>
                                    <div className="ml-auto">
                                        <span
                                            className="flex justify-center items-center gap-1 text-red-500 font-semibold cursor-pointer"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            {loading ? (<>Loading</>) : (<>
                                                <X strokeWidth={4} color="red" size={16} /> Xóa
                                            </>)}
                                        </span>
                                    </div>
                                </Group>
                            </Card>
                        ))}
                        <Pagination total={totalPage} value={page} onChange={setPage} mt={16} mx={"auto"} />
                    </>
                ) : (
                    <Text size="md" fw={600} >Không có lịch sử đọc truyện của người dùng</Text>
                )))}
            {!isLoggedIn && <Text size="md" fw={600} >Người dùng chưa đăng nhập.</Text>}
        </Stack>
    );
};

export default ReadingHistoryTab;