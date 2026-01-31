import { Table } from "@mantine/core";
import { useLast3History } from "../hooks/useHistory";
import type { StoryItem } from "../interfaces/Story";
import StoryItemCard from "./story/StoryItemCard";
import { Link } from "react-router-dom";

const HistoryTable = () => {
    const { data: historyList } = useLast3History();
    
    return (
        <div className="border border-1 border-gray-300 px-3 rounded-sm">
            <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Td>
                            <div className="flex justify-between items-center py-3">
                                <p className="text-[16px] font-semibold">Lịch sử đọc truyện</p>
                                <Link to={"/history"} className="text-[13px] font-semibold cursor-pointer">Xem tất cả</Link>
                            </div>
                        </Table.Td>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {historyList?.length > 0 ? historyList?.map((item: StoryItem) => (
                        <Table.Tr key={item.id}>
                            <Table.Td>
                                <StoryItemCard story={item} type="history" />
                            </Table.Td>
                        </Table.Tr>
                    )) : <Table.Tr>
                        <Table.Td>
                            <p className="text-center py-1">Chưa có lịch sử đọc truyện</p>
                        </Table.Td>
                    </Table.Tr>}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default HistoryTable;