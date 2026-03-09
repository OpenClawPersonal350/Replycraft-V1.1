// ==========================================
// Reviews Endpoints
// ==========================================
import { apiClient } from "../client";
import type { ReviewsResponse, ReviewsFilter, ReviewActionRequest, Review } from "../types";

export const reviewsApi = {
  getReviews: (filters?: ReviewsFilter) => {
    const params = new URLSearchParams();
    if (filters?.platform && filters.platform !== "all") params.set("platform", filters.platform);
    if (filters?.status && filters.status !== "all") params.set("status", filters.status);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    const query = params.toString();
    return apiClient<ReviewsResponse>(`/reviews${query ? `?${query}` : ""}`);
  },

  getReviewById: (id: string | number) =>
    apiClient<Review>(`/reviews/${id}`),

  performAction: (data: ReviewActionRequest) =>
    apiClient<{ success: boolean }>(`/reviews/${data.reviewId}/action`, { method: "POST", body: data }),

  editReply: (reviewId: string | number, reply: string) =>
    apiClient<{ success: boolean }>(`/reviews/${reviewId}/reply`, { method: "PUT", body: { reply } }),
};
