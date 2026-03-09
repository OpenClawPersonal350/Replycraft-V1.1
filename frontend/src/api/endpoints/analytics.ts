// ==========================================
// Analytics Endpoints
// ==========================================
import { apiClient } from "../client";
import type { AnalyticsOverview } from "../types";

export const analyticsApi = {
  getOverview: (period?: string) =>
    apiClient<AnalyticsOverview>(`/analytics/overview${period ? `?period=${period}` : ""}`),

  getReviewsOverTime: (period?: string) =>
    apiClient<AnalyticsOverview["reviewsOverTime"]>(`/analytics/reviews-over-time${period ? `?period=${period}` : ""}`),

  getPlatformDistribution: () =>
    apiClient<AnalyticsOverview["platformDistribution"]>("/analytics/platform-distribution"),

  getReplySuccessRate: () =>
    apiClient<AnalyticsOverview["replySuccessRate"]>("/analytics/reply-success-rate"),
};
