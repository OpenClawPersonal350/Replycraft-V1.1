// ==========================================
// Contact Endpoints
// ==========================================
import { apiClient } from "../client";
import type { ContactRequest, ContactResponse } from "../types";

export const contactApi = {
  send: (data: ContactRequest) =>
    apiClient<ContactResponse>("/contact", { method: "POST", body: data }),
};
