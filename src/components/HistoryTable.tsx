import { Table } from "@mantine/core";
// import { useLast3History } from "../hooks/useHistory";
import type { StoryItem } from "../interfaces/Story";
import StoryItemCard from "./story/StoryItemCard";
import { Link } from "react-router-dom";

const HistoryTable = () => {
    // const { data: historyList, isLoading, isError } = useLast3History();
    const fakeData: StoryItem[] = [
        {
            id: "1",
            title: "Hành Trình Tu Tiên Bắt Đầu Hành Trình Tu Tiên Bắt Đầu",
            slug: "hanh-trinh-tu-tien-bat-dau",
            image: "https://tuanluupiano.com/wp-content/uploads/2026/01/hinh-anh-anime-nu-dep-nhat-11.jpg",
            views: 125430,
            chapterNumber: 100
        }, {
            id: "2",
            title: "Hành Trình Tu Tiên Bắt Đầu Hành Trình Tu Tiên Bắt Đầu",
            slug: "hanh-trinh-tu-tien-bat-dau",
            image: "https://tuanluupiano.com/wp-content/uploads/2026/01/hinh-anh-anime-nu-dep-nhat-11.jpg",
            views: 125430,
            chapterNumber: 100
        }
    ]
    return (
        <div className="border border-1 border-gray-300 px-3 rounded-sm">
            <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                <Table.Tr>
                    <div className="flex justify-between items-center py-3">
                        <p className="text-[16px] font-semibold">Lịch sử đọc truyện</p>
                        <Link to={"/history"} className="text-[13px] font-semibold cursor-pointer">Xem tất cả</Link>
                    </div>
                </Table.Tr>
                {fakeData?.map((item: StoryItem) => (
                    <Table.Tr key={item.id}>
                        <Table.Td>
                            <StoryItemCard story={item} type="history" />
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table>
        </div>
    );
};

export default HistoryTable;