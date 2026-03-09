// ==========================================
// Settings Endpoints
// ==========================================
import { apiClient } from "../client";
import type { BusinessSettings } from "../types";

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  negativeAlerts: boolean;
}

export const settingsApi = {
  get: () =>
    apiClient<BusinessSettings>("/settings"),

  update: (data: Partial<BusinessSettings>) =>
    apiClient<{ success: boolean }>("/settings", { method: "PUT", body: data }),

  getNotifications: () =>
    apiClient<NotificationSettings>("/settings/notifications"),

  updateNotifications: (data: NotificationSettings) =>
    apiClient<{ success: boolean }>("/settings/notifications", { method: "PUT", body: data }),

  changePassword: (data: PasswordChangeRequest) =>
    apiClient<{ success: boolean }>("/settings/password", { method: "PUT", body: data }),
};
