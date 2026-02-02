import { Table, Tabs } from "@mantine/core";
import type { StoryItem } from "../interfaces/Story";
import StoryItemCard from "./story/StoryItemCard";
import { useState } from "react";
import { useTop10Story } from "../hooks/useStory.ts";

const TopStoryTable = () => {

    const [activeTab, setActiveTab] = useState<string | null>('m');
    const { data } = useTop10Story(activeTab as "m" | "w" | "d" || "m");
    
    return (
        <div>
            <Tabs variant="outline" defaultValue="m" value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab value="m">Top Tháng</Tabs.Tab>
                    <Tabs.Tab value="w">Top Tuần</Tabs.Tab>
                    <Tabs.Tab value="d">Top Ngày</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="m" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        <Table.Tbody>
                            {data?.map((item: StoryItem) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>
                                        <StoryItemCard story={item} type="top" />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
                <Tabs.Panel value="w" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        <Table.Tbody>
                            {data?.map((item: StoryItem) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>
                                        <StoryItemCard story={item} type="top" />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
                <Tabs.Panel value="d" pt="xs" className="border border-1 rounded-b-sm px-3 pt-0">
                    <Table horizontalSpacing={0} verticalSpacing={"sm"} >
                        <Table.Tbody>
                            {data?.map((item: StoryItem) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>
                                        <StoryItemCard story={item} type="top" />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>
        </div>
    )
};

export default TopStoryTable;