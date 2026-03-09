// ==========================================
// Mock Data - Used as fallback until backend is connected
// Remove this file once real API is live
// ==========================================
import type {
  DashboardData, Review, AnalyticsOverview, Integration,
  BusinessSettings, BillingInfo, Testimonial, PricingPlan, User
} from "./types";

export const mockUser: User = {
  id: "1",
  fullName: "John Doe",
  email: "john@acmerestaurant.com",
  plan: "Pro",
  createdAt: "2025-01-15",
};

export const mockDashboardData: DashboardData = {
  stats: {
    totalReviews: 1284,
    totalReviewsChange: "+12%",
    aiRepliesSent: 1156,
    aiRepliesChange: "+8%",
    averageRating: 4.7,
    averageRatingChange: "+0.2",
    pendingApprovals: 23,
    pendingApprovalsChange: "-5",
  },
  chartData: [
    { name: "Jan", reviews: 65, replies: 58 },
    { name: "Feb", reviews: 78, replies: 72 },
    { name: "Mar", reviews: 90, replies: 85 },
    { name: "Apr", reviews: 110, replies: 105 },
    { name: "May", reviews: 125, replies: 120 },
    { name: "Jun", reviews: 145, replies: 138 },
    { name: "Jul", reviews: 160, replies: 155 },
  ],
  sentimentData: [
    { name: "Positive", value: 72, color: "hsl(142, 71%, 45%)" },
    { name: "Neutral", value: 18, color: "hsl(239, 84%, 67%)" },
    { name: "Negative", value: 10, color: "hsl(0, 84%, 60%)" },
  ],
  recentActivity: [
    { id: "1", type: "reply", text: "AI replied to Sarah M.'s 5-star review on Google", time: "2 min ago" },
    { id: "2", type: "review", text: "New 4-star review from James L. on Yelp", time: "15 min ago" },
    { id: "3", type: "reply", text: "AI replied to Anna K.'s review on TripAdvisor", time: "1 hr ago" },
    { id: "4", type: "alert", text: "New 2-star review needs attention", time: "3 hr ago" },
    { id: "5", type: "reply", text: "AI replied to Mike R.'s 5-star review on Google", time: "5 hr ago" },
  ],
  avgResponseTime: "2.4s",
  autoReplyRate: 90,
  autoReplyTotal: 1156,
  autoReplyCount: 1040,
};

export const mockReviews: Review[] = [
  { id: 1, customer: "Sarah M.", platform: "Google", rating: 5, review: "Amazing food and great service!", aiReply: "Thank you Sarah! We're thrilled you enjoyed your experience.", status: "pending" },
  { id: 2, customer: "James L.", platform: "Yelp", rating: 4, review: "Good atmosphere, food was decent.", aiReply: "Thanks for your feedback, James! We're glad you enjoyed the atmosphere.", status: "approved" },
  { id: 3, customer: "Anna K.", platform: "TripAdvisor", rating: 2, review: "Long wait times and cold food.", aiReply: "We sincerely apologize for the experience, Anna. We've addressed this with our team.", status: "pending" },
  { id: 4, customer: "Mike R.", platform: "Google", rating: 5, review: "Best brunch in town!", aiReply: "Thanks so much Mike! We love hearing that our brunch hits the spot.", status: "approved" },
  { id: 5, customer: "Lisa T.", platform: "App Store", rating: 3, review: "App works but crashes sometimes.", aiReply: "Thank you for your feedback, Lisa. We're working on stability improvements.", status: "rejected" },
];

export const mockAnalytics: AnalyticsOverview = {
  reviewsOverTime: [
    { month: "Jan", reviews: 65 }, { month: "Feb", reviews: 78 }, { month: "Mar", reviews: 90 },
    { month: "Apr", reviews: 110 }, { month: "May", reviews: 125 }, { month: "Jun", reviews: 145 },
  ],
  platformDistribution: [
    { name: "Google", value: 45, color: "hsl(239, 84%, 67%)" },
    { name: "Yelp", value: 25, color: "hsl(142, 71%, 45%)" },
    { name: "TripAdvisor", value: 15, color: "hsl(188, 94%, 43%)" },
    { name: "App Store", value: 10, color: "hsl(45, 93%, 47%)" },
    { name: "Play Store", value: 5, color: "hsl(0, 84%, 60%)" },
  ],
  replySuccessRate: [
    { month: "Jan", rate: 89 }, { month: "Feb", rate: 91 }, { month: "Mar", rate: 93 },
    { month: "Apr", rate: 95 }, { month: "May", rate: 96 }, { month: "Jun", rate: 97 },
  ],
};

export const mockIntegrations: Integration[] = [
  { id: "1", platform: "google", name: "Google Reviews", description: "Monitor and reply to Google Business reviews automatically with AI-powered responses.", connected: true, logo: "/logos/google.svg", category: "reviews", reviewCount: 856, lastSyncAt: "2026-03-08T10:30:00Z", syncStatus: "idle" },
  { id: "2", platform: "yelp", name: "Yelp", description: "Track and respond to Yelp reviews. Maintain your reputation across the platform.", connected: true, logo: "/logos/yelp.svg", category: "reviews", reviewCount: 342, lastSyncAt: "2026-03-08T09:15:00Z", syncStatus: "idle" },
  { id: "3", platform: "tripadvisor", name: "TripAdvisor", description: "Manage TripAdvisor reviews from one dashboard. Perfect for hospitality businesses.", connected: false, logo: "/logos/tripadvisor.svg", category: "reviews", reviewCount: 0, syncStatus: "idle" },
  { id: "4", platform: "appstore", name: "App Store", description: "Reply to iOS app reviews with AI assistance. Boost your app's ratings and retention.", connected: false, logo: "/logos/appstore.svg", category: "app_store", reviewCount: 0, syncStatus: "idle" },
  { id: "5", platform: "googleplay", name: "Google Play", description: "Monitor and reply to Android app reviews. Keep your Play Store ratings high.", connected: false, logo: "/logos/googleplay.svg", category: "app_store", reviewCount: 0, syncStatus: "idle" },
  { id: "6", platform: "trustpilot", name: "Trustpilot", description: "Manage your Trustpilot presence. Reply to reviews and build customer trust.", connected: false, logo: "/logos/trustpilot.svg", category: "reviews", reviewCount: 0, syncStatus: "idle" },
];

export const mockSettings: BusinessSettings = {
  businessName: "Acme Restaurant",
  brandTone: "professional",
  replyLanguage: "english",
  useEmojis: false,
  replyMode: "approval",
  replyDelay: "1h",
  autoReply: true,
  emailNotifications: true,
  negativeAlerts: true,
};

export const mockBillingInfo: BillingInfo = {
  currentPlan: { id: "pro", name: "Pro", price: "$79", period: "/mo", repliesPerDay: "1,000/day", features: ["1,000 AI replies/day", "Unlimited platforms", "Full analytics suite", "Dedicated support", "Custom templates"], icon: "crown", popular: true, order: 2 },
  allPlans: [
    { id: "free", name: "Free", price: "$0", period: "/mo", repliesPerDay: "5/day", features: ["5 AI replies/day", "1 platform", "Basic analytics", "Email support"], icon: "zap", popular: false, order: 0 },
    { id: "go", name: "Go", price: "$29", period: "/mo", repliesPerDay: "200/day", features: ["200 AI replies/day", "3 platforms", "Advanced analytics", "Priority support"], icon: "rocket", popular: false, order: 1 },
    { id: "pro", name: "Pro", price: "$79", period: "/mo", repliesPerDay: "1,000/day", features: ["1,000 AI replies/day", "Unlimited platforms", "Full analytics suite", "Dedicated support", "Custom templates"], icon: "crown", popular: true, order: 2 },
    { id: "ultra", name: "Ultra", price: "$199", period: "/mo", repliesPerDay: "5,000/day", features: ["5,000 AI replies/day", "Unlimited platforms", "White-label reports", "API access", "Account manager"], icon: "sparkles", popular: false, order: 3 },
  ],
  nextBillingDate: "April 6, 2026",
  usage: { aiRepliesUsed: 742, aiRepliesLimit: 1000, platformsConnected: 4, platformsLimit: null, storageUsedGb: 2.1, storageLimitGb: 10 },
  invoices: [
    { id: "INV-2026-003", date: "Mar 6, 2026", amount: "$79.00", status: "Paid", downloadUrl: "#" },
    { id: "INV-2026-002", date: "Feb 6, 2026", amount: "$79.00", status: "Paid", downloadUrl: "#" },
    { id: "INV-2026-001", date: "Jan 6, 2026", amount: "$79.00", status: "Paid", downloadUrl: "#" },
  ],
};
