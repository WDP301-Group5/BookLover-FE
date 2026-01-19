import { Table, Tabs } from "@mantine/core";
import type { StoryItem } from "../interfaces/Story";
import StoryItemCard from "./story/StoryItemCard";

const TopStoryTable = () => {
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
        <div>
            <Tabs variant="outline" defaultValue="month" className="">
                <Tabs.List className="w-full">
                    <Tabs.Tab value="month" className="w-1/3">Top Tháng</Tabs.Tab>
                    <Tabs.Tab value="week" className="w-1/3">Top Tuần</Tabs.Tab>
                    <Tabs.Tab value="day" className="w-1/3">Top Ngày</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="month" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        {fakeData?.map((item: StoryItem) => (
                            <Table.Tr key={item.id}>
                                <Table.Td>
                                    <StoryItemCard story={item} type="history" />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table>
                </Tabs.Panel>
                <Tabs.Panel value="week" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        {fakeData?.map((item: StoryItem) => (
                            <Table.Tr key={item.id}>
                                <Table.Td>
                                    <StoryItemCard story={item} type="history" />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table>
                </Tabs.Panel>
                <Tabs.Panel value="day" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        {fakeData?.map((item: StoryItem) => (
                            <Table.Tr key={item.id}>
                                <Table.Td>
                                    <StoryItemCard story={item} type="history" />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
};

export default TopStoryTable;