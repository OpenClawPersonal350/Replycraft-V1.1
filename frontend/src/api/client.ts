// ==========================================
// API Client - Central HTTP layer
// ==========================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  /**
   * If true, do not JSON.stringify the body (e.g. for FormData).
   */
  raw?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("auth_token");
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, raw = false } = options;

  const token = getAuthToken();
  const defaultHeaders: Record<string, string> = {
    ...(raw ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? (raw ? (body as BodyInit) : JSON.stringify(body)) : undefined,
    });
  } catch (networkError) {
    throw new ApiError("Network error — unable to reach backend", 0);
  }

  if (!response.ok) {
    let errorData: { message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // non-JSON error body
    }

    // Auto-logout on 401
    if (response.status === 401) {
      clearAuthToken();
      // Don't redirect here — let the auth hook handle it
    }

    throw new ApiError(
      errorData.message || `API error: ${response.status}`,
      response.status,
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
