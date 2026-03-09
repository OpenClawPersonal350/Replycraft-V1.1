// ==========================================
// Shared API Types for entire application
// ==========================================

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  plan: string;
  createdAt: string;
}

export interface PasswordResetRequest {
  email: string;
}

// ---- Dashboard ----
export interface DashboardStats {
  totalReviews: number;
  totalReviewsChange: string;
  aiRepliesSent: number;
  aiRepliesChange: string;
  averageRating: number;
  averageRatingChange: string;
  pendingApprovals: number;
  pendingApprovalsChange: string;
}

export interface ChartDataPoint {
  name: string;
  reviews: number;
  replies: number;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "reply" | "review" | "alert";
  text: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  sentimentData: SentimentData[];
  recentActivity: ActivityItem[];
  avgResponseTime: string;
  autoReplyRate: number;
  autoReplyTotal: number;
  autoReplyCount: number;
}

// ---- Reviews ----
export interface Review {
  id: string | number;
  customer: string;
  platform: string;
  rating: number;
  review: string;
  aiReply: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export interface ReviewsFilter {
  platform?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReviewActionRequest {
  reviewId: string | number;
  action: "approve" | "reject" | "edit";
  editedReply?: string;
}

// ---- Analytics ----
export interface AnalyticsOverview {
  reviewsOverTime: { month: string; reviews: number }[];
  platformDistribution: { name: string; value: number; color: string }[];
  replySuccessRate: { month: string; rate: number }[];
}

// ---- Integrations ----
export interface Integration {
  id: string;
  name: string;
  platform: string; // unique key e.g. "google", "yelp"
  description: string;
  connected: boolean;
  logo: string;
  category: "reviews" | "app_store" | "e-commerce";
  reviewCount: number;
  lastSyncAt?: string;
  syncStatus?: "idle" | "syncing" | "error";
}

export interface IntegrationToggleRequest {
  integrationId: string;
  connect: boolean;
}

export interface IntegrationSyncRequest {
  integrationId: string;
}

export interface IntegrationSyncResponse {
  success: boolean;
  reviewCount: number;
  lastSyncAt: string;
}

// ---- Profile ----
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
  plan: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
}

// ---- OTP ----
export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface OtpResendRequest {
  email: string;
}

// ---- Settings ----
export interface BusinessSettings {
  businessName: string;
  brandTone: string;
  replyLanguage: string;
  useEmojis: boolean;
  replyMode: string;
  replyDelay: string;
  autoReply: boolean;
  emailNotifications: boolean;
  negativeAlerts: boolean;
}

// ---- Billing ----
export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  repliesPerDay: string;
  features: string[];
  icon: string; // "zap" | "rocket" | "crown" | "sparkles"
  popular: boolean;
  order: number; // tier ordering for upgrade/downgrade logic
}

export interface UsageInfo {
  aiRepliesUsed: number;
  aiRepliesLimit: number;
  platformsConnected: number;
  platformsLimit: number | null; // null = unlimited
  storageUsedGb: number;
  storageLimitGb: number;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  downloadUrl: string;
}

export interface BillingInfo {
  currentPlan: Plan;
  allPlans: Plan[];
  nextBillingDate: string;
  usage: UsageInfo;
  invoices: Invoice[];
}

// ---- Payment ----
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string; // "card" | "paypal" | "razorpay" | "upi" | "netbanking" | "wallet"
  description: string;
  region: "global" | "india" | "all";
  enabled: boolean;
}

export interface PaymentOrderSummary {
  planId: string;
  planName: string;
  billing: "monthly" | "yearly";
  basePrice: number;
  currency: string;
  currencySymbol: string;
  discount: number;
  discountLabel?: string;
  tax: number;
  taxLabel?: string;
  total: number;
  period: string;
  features: string[];
}

export interface CouponValidateRequest {
  code: string;
  planId: string;
}

export interface CouponValidateResponse {
  valid: boolean;
  discountPercent: number;
  discountLabel: string;
  message: string;
}

export interface PaymentInitRequest {
  planId: string;
  billing: "monthly" | "yearly";
  paymentMethodId: string;
  couponCode?: string;
}

export interface PaymentInitResponse {
  orderId: string;
  gatewayOrderId?: string;
  gateway: string; // "razorpay" | "stripe" | "paypal"
  clientSecret?: string;
  redirectUrl?: string;
  amount: number;
  currency: string;
}

export interface PaymentVerifyRequest {
  orderId: string;
  gatewayPaymentId: string;
  gatewaySignature?: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  redirectTo: string;
}

export interface UserRegionInfo {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  region: "india" | "global";
}

// ---- Contact ----
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// ---- Landing Page ----
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
  ctaLabel: string;
}
