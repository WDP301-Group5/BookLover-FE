import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Alert,
  Button,
  Card,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import AdminDashboardService from "../../../services/adminDashboardService";
import type { AdminDashboardOverview } from "../../../types/adminDashboard";
import SummaryCard from "./SummaryCard";

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardOverview | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupBy, setGroupBy] = useState<"day" | "month" | "year">("day");

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await AdminDashboardService.getOverview(groupBy);
        setDashboard(res.data);
      } catch (err: unknown) {
        console.error("Fetch admin dashboard error:", err);
        setError("Không thể tải dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [groupBy]);

  const summary = dashboard?.summary;
  const charts = dashboard?.charts;

  const summaryCards = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "Tổng số user",
        value: formatNumber(summary.totalUsers),
      },
      {
        title: "Tổng số tác giả",
        value: formatNumber(summary.totalAuthors),
      },
      {
        title: "Tổng số truyện",
        value: formatNumber(summary.totalStories),
      },
      {
        title: "Tổng số chương",
        value: formatNumber(summary.totalChapters),
      },
      {
        title: "Tổng số review",
        value: formatNumber(summary.totalReviews),
      },
      {
        title: "Bài viết diễn đàn",
        value: formatNumber(summary.totalForumPosts),
      },
      {
        title: "Bình luận diễn đàn",
        value: formatNumber(summary.totalForumComments),
      },
      {
        title: "Lượt đọc hôm nay",
        value: formatNumber(summary.readToday),
      },
      {
        title: "Lượt đọc tuần này",
        value: formatNumber(summary.readWeek),
      },
      {
        title: "Lượt đọc tháng này",
        value: formatNumber(summary.readMonth),
      },
      {
        title: "Truyện mới hôm nay",
        value: formatNumber(summary.newStoriesToday),
      },
      {
        title: "Truyện chờ duyệt",
        value: formatNumber(summary.pendingStories),
      },
      {
        title: "Chương chờ duyệt",
        value: formatNumber(summary.pendingChapters),
      },
      {
        title: "Doanh thu hôm nay",
        value: formatCurrency(summary.revenueToday),
      },
      {
        title: "Doanh thu tháng này",
        value: formatCurrency(summary.revenueMonth),
      },
    ];
  }, [summary]);

  const chartTextColor = isDark ? theme.colors.dark[0] : theme.black;
  const chartGridColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const chartAxisColor = isDark ? theme.colors.gray[5] : theme.colors.gray[7];
  const chartTooltipStyle = {
    backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
    border: `1px solid ${
      isDark ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    color: chartTextColor,
    borderRadius: "8px",
  };

  if (loading) {
    return (
      <Stack p="md">
        <Title order={2}>Admin Dashboard</Title>
        <Card withBorder radius="xl" p="lg">
          <Group>
            <Loader size="sm" />
            <Text c="dimmed">Đang tải dashboard...</Text>
          </Group>
        </Card>
      </Stack>
    );
  }

  if (error || !dashboard) {
    return (
      <Stack p="md">
        <Title order={2}>Admin Dashboard</Title>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Lỗi dữ liệu"
          color="red"
          radius="xl"
          variant="light"
        >
          {error || "Không có dữ liệu dashboard"}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" p="xs">
      <div>
        <Title order={2}>Tổng quan hệ thống</Title>
      </div>

      <section>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }} spacing="md">
          {summaryCards.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
            />
          ))}
        </SimpleGrid>
      </section>

      <Group justify="space-between" align="center">
        <Title order={3}>Biểu đồ thống kê</Title>

        <SegmentedControl
          value={groupBy}
          onChange={(value) => setGroupBy(value as "day" | "month" | "year")}
          data={[
            { label: "Ngày", value: "day" },
            { label: "Tháng", value: "month" },
            { label: "Năm", value: "year" },
          ]}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg">
        <Card withBorder radius="xl" p="md" shadow="sm">
          <Title order={4} mb="md">
            User mới theo ngày
          </Title>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.newUsers || []}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke={chartAxisColor} />
                <YAxis allowDecimals={false} stroke={chartAxisColor} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="User mới"
                  stroke={theme.colors.blue[6]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card withBorder radius="xl" p="md" shadow="sm">
          <Title order={4} mb="md">
            Lượt đọc theo ngày
          </Title>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.reads || []}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke={chartAxisColor} />
                <YAxis allowDecimals={false} stroke={chartAxisColor} />
                <Tooltip
                  formatter={(value) => formatNumber(Number(value))}
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Lượt đọc"
                  fill={theme.colors.green[6]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card withBorder radius="xl" p="md" shadow="sm">
          <Title order={4} mb="md">
            Doanh thu theo ngày
          </Title>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.revenue || []}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke={chartAxisColor} />
                <YAxis stroke={chartAxisColor} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
                  stroke={theme.colors.yellow[6]}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card withBorder radius="xl" p="md" shadow="sm">
          <Title order={4} mb="md">
            Số truyện được đăng theo tháng
          </Title>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.stories || []}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke={chartAxisColor} />
                <YAxis allowDecimals={false} stroke={chartAxisColor} />
                <Tooltip
                  formatter={(value) => formatNumber(Number(value))}
                  contentStyle={chartTooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Số truyện"
                  fill={theme.colors.grape[6]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}