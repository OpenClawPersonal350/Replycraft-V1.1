// ==========================================
// API - Central export for all endpoints
// ==========================================
// Usage: import { api } from "@/api";
//        api.auth.login({ email, password });
//        api.dashboard.getDashboardData();

export { authApi } from "./endpoints/auth";
export { dashboardApi } from "./endpoints/dashboard";
export { reviewsApi } from "./endpoints/reviews";
export { analyticsApi } from "./endpoints/analytics";
export { integrationsApi } from "./endpoints/integrations";
export { settingsApi } from "./endpoints/settings";
export { billingApi } from "./endpoints/billing";
export { paymentApi } from "./endpoints/payment";
export { contactApi } from "./endpoints/contact";
export { landingApi } from "./endpoints/landing";

// Grouped export for convenience
import { authApi } from "./endpoints/auth";
import { dashboardApi } from "./endpoints/dashboard";
import { reviewsApi } from "./endpoints/reviews";
import { analyticsApi } from "./endpoints/analytics";
import { integrationsApi } from "./endpoints/integrations";
import { settingsApi } from "./endpoints/settings";
import { billingApi } from "./endpoints/billing";
import { paymentApi } from "./endpoints/payment";
import { contactApi } from "./endpoints/contact";
import { landingApi } from "./endpoints/landing";

export const api = {
  auth: authApi,
  dashboard: dashboardApi,
  reviews: reviewsApi,
  analytics: analyticsApi,
  integrations: integrationsApi,
  settings: settingsApi,
  billing: billingApi,
  payment: paymentApi,
  contact: contactApi,
  landing: landingApi,
};

// Re-export all types
export type * from "./types";
