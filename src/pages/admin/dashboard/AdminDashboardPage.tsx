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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
        <div className="rounded-xl border bg-white p-6 text-gray-500">
          Đang tải dashboard...
        </div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error || "Không có dữ liệu dashboard"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
      </div>

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
            />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Biểu đồ thống kê
        </h2>

        <div className="flex items-center gap-2 rounded-lg border bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setGroupBy("day")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              groupBy === "day"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Ngày
          </button>

          <button
            type="button"
            onClick={() => setGroupBy("month")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              groupBy === "month"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tháng
          </button>

          <button
            type="button"
            onClick={() => setGroupBy("year")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              groupBy === "year"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Năm
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            User mới theo ngày
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.newUsers || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="User mới"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Lượt đọc theo ngày
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.reads || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="value" name="Lượt đọc" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Doanh thu theo ngày
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Doanh thu"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Số truyện được đăng theo tháng
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.stories || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                <Bar dataKey="value" name="Số truyện" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
