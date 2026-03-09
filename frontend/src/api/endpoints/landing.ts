// ==========================================
// Landing Page Endpoints (testimonials, pricing, etc.)
// ==========================================
import { apiClient } from "../client";
import type { Testimonial, PricingPlan } from "../types";

export const landingApi = {
  getTestimonials: () =>
    apiClient<Testimonial[]>("/landing/testimonials"),

  getPricingPlans: () =>
    apiClient<PricingPlan[]>("/landing/pricing"),
};
