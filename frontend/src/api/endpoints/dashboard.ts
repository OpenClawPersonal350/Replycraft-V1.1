// ==========================================
// Dashboard Endpoints
// ==========================================
import { apiClient } from "../client";
import type { DashboardData } from "../types";

export const dashboardApi = {
  getDashboardData: () =>
    apiClient<DashboardData>("/dashboard"),

  getStats: () =>
    apiClient<DashboardData["stats"]>("/dashboard/stats"),

  getChartData: (period?: string) =>
    apiClient<DashboardData["chartData"]>(`/dashboard/chart${period ? `?period=${period}` : ""}`),

  getSentiment: () =>
    apiClient<DashboardData["sentimentData"]>("/dashboard/sentiment"),

  getActivity: (limit?: number) =>
    apiClient<DashboardData["recentActivity"]>(`/dashboard/activity${limit ? `?limit=${limit}` : ""}`),
};
