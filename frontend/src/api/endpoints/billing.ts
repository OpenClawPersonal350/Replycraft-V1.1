// ==========================================
// Billing Endpoints
// ==========================================
import { apiClient } from "../client";
import type { BillingInfo, Invoice, UsageInfo, Plan } from "../types";

export const billingApi = {
  getBillingInfo: () =>
    apiClient<BillingInfo>("/billing"),

  getUsage: () =>
    apiClient<UsageInfo>("/billing/usage"),

  getInvoices: () =>
    apiClient<Invoice[]>("/billing/invoices"),

  downloadInvoice: (invoiceId: string) =>
    apiClient<{ downloadUrl: string }>(`/billing/invoices/${invoiceId}/download`),

  changePlan: (planId: string) =>
    apiClient<{ success: boolean; message: string }>("/billing/change-plan", { method: "POST", body: { planId } }),

  cancelSubscription: () =>
    apiClient<{ success: boolean }>("/billing/cancel", { method: "POST" }),

  getUpgradePlans: (currentPlanId: string) =>
    apiClient<Plan[]>(`/billing/upgrade-options?currentPlan=${currentPlanId}`),
};
