// ==========================================
// Integrations Endpoints
// ==========================================
import { apiClient } from "../client";
import type { Integration, IntegrationToggleRequest, IntegrationSyncRequest, IntegrationSyncResponse } from "../types";

export const integrationsApi = {
  /** Get all available integrations with their connection status */
  getAll: () =>
    apiClient<Integration[]>("/integrations"),

  /** Connect or disconnect a platform */
  toggle: (data: IntegrationToggleRequest) =>
    apiClient<Integration>(`/integrations/${data.integrationId}/toggle`, { method: "POST", body: data }),

  /** Trigger a manual sync for a connected integration */
  sync: (data: IntegrationSyncRequest) =>
    apiClient<IntegrationSyncResponse>(`/integrations/${data.integrationId}/sync`, { method: "POST" }),

  /** Disconnect a platform */
  disconnect: (integrationId: string) =>
    apiClient<{ success: boolean }>(`/integrations/${integrationId}`, { method: "DELETE" }),
};
