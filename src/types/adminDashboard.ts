export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalAuthors: number;
  totalStories: number;
  totalChapters: number;
  totalReviews: number;
  totalForumPosts: number;
  totalForumComments: number;
  readToday: number;
  readWeek: number;
  readMonth: number;
  newStoriesToday: number;
  pendingStories: number;
  pendingChapters: number;
  revenueToday: number;
  revenueMonth: number;
}

export interface DashboardCharts {
  newUsers: ChartPoint[];
  reads: ChartPoint[];
  revenue: ChartPoint[];
  stories: ChartPoint[];
}

export interface AdminDashboardOverview {
  summary: DashboardSummary;
  charts: DashboardCharts;
}

export interface AdminDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: AdminDashboardOverview;
}