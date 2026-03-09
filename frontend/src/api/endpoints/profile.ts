// ==========================================
// Profile Endpoints
// ==========================================
import { apiClient } from "../client";
import type { UserProfile, ProfileUpdateRequest } from "../types";

export const profileApi = {
  get: () =>
    apiClient<UserProfile>("/profile"),

  update: (data: ProfileUpdateRequest) =>
    apiClient<UserProfile>("/profile", { method: "PUT", body: data }),

  uploadAvatar: (file: FormData) =>
    apiClient<{ avatarUrl: string }>("/profile/avatar", { method: "POST", body: file }),

  completeOnboarding: () =>
    apiClient<{ success: boolean }>("/profile/complete-onboarding", { method: "POST" }),
};
