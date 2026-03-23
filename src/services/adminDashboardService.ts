import type { AdminDashboardOverviewResponse } from "../types/adminDashboard";
import { instance as axios } from "../lib/axios";

export type DashboardGroupBy = "day" | "month" | "year";

const AdminDashboardService = {
  async getOverview(groupBy: DashboardGroupBy = "day") {
    const response = await axios.get<AdminDashboardOverviewResponse>(
      "/admin/dashboard/overview",
      {
        params: { groupBy },
      }
    );
    return response.data;
  },
};

export default AdminDashboardService;