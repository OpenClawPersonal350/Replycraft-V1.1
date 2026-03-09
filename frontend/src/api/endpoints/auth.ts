// ==========================================
// Auth Endpoints - Firebase Authentication
// ==========================================
import { apiClient } from "../client";
import type { LoginRequest, SignupRequest, AuthResponse, User, PasswordResetRequest } from "../types";

export const authApi = {
  // Firebase login - exchanges Firebase ID token for backend JWT
  firebaseLogin: (data: { idToken: string; email?: string; name?: string }) =>
    apiClient<AuthResponse>("/auth/firebase-login", { method: "POST", body: data }),

  // Legacy login (fallback for non-Firebase)
  login: (data: LoginRequest) =>
    apiClient<AuthResponse>("/auth/login", { method: "POST", body: data }),

  // Legacy signup (fallback for non-Firebase)
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
};
