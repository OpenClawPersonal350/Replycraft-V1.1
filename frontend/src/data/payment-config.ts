// ==========================================
// Payment configuration data
// This will be replaced by API calls when backend is connected
// ==========================================

export interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  regions: string[]; // "IN" for India, "GLOBAL" for everywhere else, "ALL" for both
  enabled: boolean;
  gateway: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
}

export const paymentMethods: PaymentMethodConfig[] = [
  // India-specific methods
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Cards, UPI, Wallets & more",
    icon: "razorpay",
    regions: ["IN"],
    enabled: true,
    gateway: "razorpay",
  },
  {
    id: "upi",
    name: "UPI",
    description: "Google Pay, PhonePe, Paytm",
    icon: "upi",
    regions: ["IN"],
    enabled: true,
    gateway: "razorpay",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    description: "All major Indian banks",
    icon: "netbanking",
    regions: ["IN"],
    enabled: true,
    gateway: "razorpay",
  },
  {
    id: "wallet_in",
    name: "Wallets",
    description: "Paytm, Mobikwik, Freecharge",
    icon: "wallet",
    regions: ["IN"],
    enabled: true,
    gateway: "razorpay",
  },
  // Global methods
  {
    id: "card",
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex",
    icon: "card",
    regions: ["GLOBAL"],
    enabled: true,
    gateway: "stripe",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account",
    icon: "paypal",
    regions: ["GLOBAL"],
    enabled: true,
    gateway: "paypal",
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    description: "Fast & secure with Face ID",
    icon: "apple",
    regions: ["GLOBAL"],
    enabled: true,
    gateway: "stripe",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    description: "Quick checkout with Google",
    icon: "google",
    regions: ["GLOBAL"],
    enabled: true,
    gateway: "stripe",
  },
];

export const plans: PlanConfig[] = [
  {
    id: "go",
    name: "Go",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "200 AI replies/day",
      "3 platform integrations",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      "1,000 AI replies/day",
      "Unlimited integrations",
      "Advanced analytics",
      "Priority support",
      "Custom AI tone",
    ],
    popular: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      "5,000 AI replies/day",
      "Unlimited everything",
      "White-label options",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
  },
];

export const currencyByCountry: Record<string, { currency: string; symbol: string; rate: number }> = {
  IN: { currency: "INR", symbol: "₹", rate: 83 },
  US: { currency: "USD", symbol: "$", rate: 1 },
  GB: { currency: "GBP", symbol: "£", rate: 0.79 },
  CA: { currency: "CAD", symbol: "CA$", rate: 1.36 },
  AU: { currency: "AUD", symbol: "A$", rate: 1.53 },
  DE: { currency: "EUR", symbol: "€", rate: 0.92 },
  FR: { currency: "EUR", symbol: "€", rate: 0.92 },
  JP: { currency: "JPY", symbol: "¥", rate: 149 },
  SG: { currency: "SGD", symbol: "S$", rate: 1.34 },
  AE: { currency: "AED", symbol: "د.إ", rate: 3.67 },
  BR: { currency: "BRL", symbol: "R$", rate: 4.97 },
};

export const TAX_RATES: Record<string, { rate: number; label: string }> = {
  IN: { rate: 18, label: "GST (18%)" },
  US: { rate: 0, label: "" },
  GB: { rate: 20, label: "VAT (20%)" },
  DE: { rate: 19, label: "VAT (19%)" },
  FR: { rate: 20, label: "VAT (20%)" },
  AU: { rate: 10, label: "GST (10%)" },
  CA: { rate: 13, label: "HST (13%)" },
  SG: { rate: 8, label: "GST (8%)" },
  JP: { rate: 10, label: "Tax (10%)" },
};

export function getMethodsForCountry(countryCode: string): PaymentMethodConfig[] {
  const region = countryCode === "IN" ? "IN" : "GLOBAL";
  return paymentMethods.filter(
    (m) => m.enabled && (m.regions.includes(region) || m.regions.includes("ALL"))
  );
}

export function getCurrencyInfo(countryCode: string) {
  return currencyByCountry[countryCode] || { currency: "USD", symbol: "$", rate: 1 };
}

export function getTaxInfo(countryCode: string) {
  return TAX_RATES[countryCode] || { rate: 0, label: "" };
}

export function getPlanById(planId: string) {
  return plans.find((p) => p.id === planId);
}
