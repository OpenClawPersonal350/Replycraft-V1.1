// ==========================================
// API Client - Central HTTP layer with Firebase Auth
// ==========================================

import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

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

// Store Firebase ID token
let firebaseIdToken: string | null = localStorage.getItem('firebase_token');

export function setFirebaseToken(token: string) {
  firebaseIdToken = token;
  localStorage.setItem('firebase_token', token);
}

export function getFirebaseToken(): string | null {
  return firebaseIdToken;
}

export function clearFirebaseToken() {
  firebaseIdToken = null;
  localStorage.removeItem('firebase_token');
}

export function getAuthToken(): string | null {
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

  // Prefer Firebase token, fallback to regular JWT
  const firebaseToken = getFirebaseToken();
  const jwtToken = getAuthToken();
  const token = firebaseToken || jwtToken;

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
      clearFirebaseToken();
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

// ==========================================
// Firebase Authentication Functions
// ==========================================

export async function loginWithGoogle(): Promise<string> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not initialized');
  }
  
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  
  // Send token to backend to create/get user
  const response = await apiClient<{ user: unknown; token: string }>('/auth/firebase-login', {
    method: 'POST',
    body: { idToken }
  });
  
  // Store both Firebase token and backend JWT
  setFirebaseToken(idToken);
  setAuthToken(response.token);
  
  return response.token;
}

export async function logoutFirebase() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Firebase logout error (can be ignored):', e);
    }
  }
  clearFirebaseToken();
  clearAuthToken();
}
