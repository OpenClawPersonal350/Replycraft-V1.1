// ==========================================
// React Query hooks for all API endpoints
// ==========================================
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "./endpoints/dashboard";
import { reviewsApi } from "./endpoints/reviews";
import { analyticsApi } from "./endpoints/analytics";
import { integrationsApi } from "./endpoints/integrations";
import { settingsApi } from "./endpoints/settings";
import { billingApi } from "./endpoints/billing";
import { paymentApi } from "./endpoints/payment";
import { contactApi } from "./endpoints/contact";
import { landingApi } from "./endpoints/landing";
import { authApi } from "./endpoints/auth";
import { profileApi } from "./endpoints/profile";
import type {
  LoginRequest, SignupRequest, ReviewsFilter, ReviewActionRequest,
  BusinessSettings, ContactRequest, IntegrationToggleRequest, PasswordResetRequest,
  IntegrationSyncRequest, ProfileUpdateRequest, OtpVerifyRequest, OtpResendRequest,
  CouponValidateRequest, PaymentInitRequest, PaymentVerifyRequest
} from "./types";

// ---- Auth ----
export const useCurrentUser = () =>
  useQuery({ queryKey: ["auth", "me"], queryFn: authApi.getMe, retry: false });

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      localStorage.setItem("auth_token", res.token);
      qc.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

export const useSignup = () =>
  useMutation({ mutationFn: (data: SignupRequest) => authApi.signup(data) });

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      qc.clear();
    },
  });
};

export const useResetPassword = () =>
  useMutation({ mutationFn: (data: PasswordResetRequest) => authApi.resetPassword(data) });

export const useVerifyOtp = () =>
  useMutation({ mutationFn: (data: OtpVerifyRequest) => authApi.verifyOtp(data) });

export const useResendOtp = () =>
  useMutation({ mutationFn: (data: OtpResendRequest) => authApi.resendOtp(data) });

// ---- Profile ----
export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: profileApi.get });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => profileApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};

export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => profileApi.uploadAvatar(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};

export const useCompleteOnboarding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.completeOnboarding,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};

// ---- Dashboard ----
export const useDashboardData = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.getDashboardData });

export const useDashboardStats = () =>
  useQuery({ queryKey: ["dashboard", "stats"], queryFn: dashboardApi.getStats });

export const useDashboardChart = (period?: string) =>
  useQuery({ queryKey: ["dashboard", "chart", period], queryFn: () => dashboardApi.getChartData(period) });

export const useDashboardSentiment = () =>
  useQuery({ queryKey: ["dashboard", "sentiment"], queryFn: dashboardApi.getSentiment });

export const useDashboardActivity = (limit?: number) =>
  useQuery({ queryKey: ["dashboard", "activity", limit], queryFn: () => dashboardApi.getActivity(limit) });

// ---- Reviews ----
export const useReviews = (filters?: ReviewsFilter) =>
  useQuery({ queryKey: ["reviews", filters], queryFn: () => reviewsApi.getReviews(filters) });

export const useReviewAction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewActionRequest) => reviewsApi.performAction(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

// ---- Analytics ----
export const useAnalyticsOverview = (period?: string) =>
  useQuery({ queryKey: ["analytics", "overview", period], queryFn: () => analyticsApi.getOverview(period) });

// ---- Integrations ----
export const useIntegrations = () =>
  useQuery({ queryKey: ["integrations"], queryFn: integrationsApi.getAll });

export const useToggleIntegration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IntegrationToggleRequest) => integrationsApi.toggle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });
};

export const useSyncIntegration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: IntegrationSyncRequest) => integrationsApi.sync(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });
};

export const useDisconnectIntegration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationsApi.disconnect(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["integrations"] }),
  });
};

// ---- Settings ----
export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: settingsApi.get });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BusinessSettings>) => settingsApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
};

export const useNotificationSettings = () =>
  useQuery({ queryKey: ["settings", "notifications"], queryFn: settingsApi.getNotifications });

export const useUpdateNotifications = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { emailNotifications: boolean; negativeAlerts: boolean }) => settingsApi.updateNotifications(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "notifications"] }),
  });
};

export const useChangePassword = () =>
  useMutation({ mutationFn: (data: { currentPassword: string; newPassword: string }) => settingsApi.changePassword(data) });

// ---- Billing ----
export const useBillingInfo = () =>
  useQuery({ queryKey: ["billing"], queryFn: billingApi.getBillingInfo });

export const useBillingUsage = () =>
  useQuery({ queryKey: ["billing", "usage"], queryFn: billingApi.getUsage });

export const useBillingInvoices = () =>
  useQuery({ queryKey: ["billing", "invoices"], queryFn: billingApi.getInvoices });

export const useDownloadInvoice = () =>
  useMutation({ mutationFn: (invoiceId: string) => billingApi.downloadInvoice(invoiceId) });

export const useChangePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => billingApi.changePlan(planId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing"] }),
  });
};

export const useUpgradePlans = (currentPlanId: string) =>
  useQuery({ queryKey: ["billing", "upgrade-options", currentPlanId], queryFn: () => billingApi.getUpgradePlans(currentPlanId) });

// ---- Payment ----
export const useUserRegion = () =>
  useQuery({ queryKey: ["payment", "region"], queryFn: paymentApi.getRegion });

export const usePaymentMethods = (region: string) =>
  useQuery({ queryKey: ["payment", "methods", region], queryFn: () => paymentApi.getPaymentMethods(region), enabled: !!region });

export const useOrderSummary = (planId: string, billing: string) =>
  useQuery({ queryKey: ["payment", "summary", planId, billing], queryFn: () => paymentApi.getOrderSummary(planId, billing), enabled: !!planId });

export const useValidateCoupon = () =>
  useMutation({ mutationFn: (data: CouponValidateRequest) => paymentApi.validateCoupon(data) });

export const useInitPayment = () =>
  useMutation({ mutationFn: (data: PaymentInitRequest) => paymentApi.initPayment(data) });

export const useVerifyPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentVerifyRequest) => paymentApi.verifyPayment(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["billing"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

// ---- Contact ----
export const useSendContact = () =>
  useMutation({ mutationFn: (data: ContactRequest) => contactApi.send(data) });

// ---- Landing ----
export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: landingApi.getTestimonials });

export const usePricingPlans = () =>
  useQuery({ queryKey: ["pricing"], queryFn: landingApi.getPricingPlans });
