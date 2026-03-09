// ==========================================
// Payment Endpoints
// ==========================================
import { apiClient } from "../client";
import type {
  PaymentMethod,
  PaymentOrderSummary,
  CouponValidateRequest,
  CouponValidateResponse,
  PaymentInitRequest,
  PaymentInitResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  UserRegionInfo,
} from "../types";

export const paymentApi = {
  getRegion: () =>
    apiClient<UserRegionInfo>("/payment/region"),

  getPaymentMethods: (region: string) =>
    apiClient<PaymentMethod[]>(`/payment/methods?region=${region}`),

  getOrderSummary: (planId: string, billing: string) =>
    apiClient<PaymentOrderSummary>(`/payment/summary?planId=${planId}&billing=${billing}`),

  validateCoupon: (data: CouponValidateRequest) =>
    apiClient<CouponValidateResponse>("/payment/coupon/validate", { method: "POST", body: data }),

  initPayment: (data: PaymentInitRequest) =>
    apiClient<PaymentInitResponse>("/payment/init", { method: "POST", body: data }),

  verifyPayment: (data: PaymentVerifyRequest) =>
    apiClient<PaymentVerifyResponse>("/payment/verify", { method: "POST", body: data }),
};
