import { Tabs, Text, Stack, Paper, Divider } from "@mantine/core";
import { IconBook, IconMessageCircle, IconStar } from "@tabler/icons-react";
import { Coins, ShoppingCart } from "lucide-react";
import ReadingHistoryTab from "./ReadingHistoryTab.tsx";
import CommenHistoryTab from "./CommentHistoryTab.tsx";
import ReviewHistoryTab from "./ReviewHistoryTab.tsx";
import RechargeHistoryTab from "./RechargeHistoryTab.tsx";
import PurchaseHistoryTab from "./PurchaseHistoryTab.tsx";
import { useSearchParams } from "react-router-dom";

const HISTORY_TABS = [
    {
        value: "reading",
        label: "Lịch sử đọc",
        icon: <IconBook size={16} />,
        component: <ReadingHistoryTab />,
    },
    {
        value: "comment",
        label: "Comment",
        icon: <IconMessageCircle size={16} />,
        component: <CommenHistoryTab />,
    },
    {
        value: "review",
        label: "Review",
        icon: <IconStar size={16} />,
        component: <ReviewHistoryTab />,
    },
    {
        value: "recharge",
        label: "Nạp linh thạch",
        icon: <Coins size={16} />,
        component: <RechargeHistoryTab />,
    },
    {
        value: "purchase",
        label: "Mua chapter",
        icon: <ShoppingCart size={16} />,
        component: <PurchaseHistoryTab />,
    },
]

const HistoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "reading";
    return (
        <Paper shadow="md" radius="md" mt={12} p="md" className="w-full" >
            <Stack mb={12} >
                <Text size="xl" fw={600}>
                    Lịch sử hoạt động
                </Text>
                <Divider />
            </Stack>
            <Tabs
                variant="outline"
                defaultValue="reading"
                value={currentTab}
                onChange={(tab) => setSearchParams({ tab: tab?.toString() || "reading" })}
            >
                <Tabs.List>
                    {HISTORY_TABS?.map((tab) => (
                        <Tabs.Tab
                            key={tab.value}
                            value={tab.value}
                            leftSection={tab.icon}
                            fw={600}
                        >
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {HISTORY_TABS?.map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value} pt="md" className="min-h-24" >
                        {tab.component}
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Paper>
    );
}

export default HistoryPage;