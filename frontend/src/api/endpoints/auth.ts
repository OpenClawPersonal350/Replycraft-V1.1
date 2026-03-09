// ==========================================
// Auth Endpoints
// ==========================================
import { apiClient } from "../client";
import type { LoginRequest, SignupRequest, AuthResponse, User, PasswordResetRequest, OtpVerifyRequest, OtpResendRequest } from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient<AuthResponse>("/auth/login", { method: "POST", body: data }),

  signup: (data: SignupRequest) =>
    apiClient<AuthResponse>("/auth/signup", { method: "POST", body: data }),

  logout: () =>
    apiClient<{ success: boolean }>("/auth/logout", { method: "POST" }),

  getMe: () =>
    apiClient<User>("/auth/me"),

  resetPassword: (data: PasswordResetRequest) =>
    apiClient<{ success: boolean; message: string }>("/auth/reset-password", { method: "POST", body: data }),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient<{ success: boolean }>("/auth/update-password", { method: "PUT", body: data }),

  verifyOtp: (data: OtpVerifyRequest) =>
    apiClient<AuthResponse>("/auth/verify-otp", { method: "POST", body: data }),

  resendOtp: (data: OtpResendRequest) =>
    apiClient<{ success: boolean; message: string }>("/auth/resend-otp", { method: "POST", body: data }),
};
