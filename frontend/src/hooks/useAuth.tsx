// ==========================================
// Auth Hook — JWT token management + route protection
// ==========================================
// DEV_BYPASS: When true, authentication is not enforced so the UI
// remains navigable during development without a running backend.
// Set to false once your backend is live.

import { createContext, useContext, useCallback, useMemo, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/api/hooks";
import { setAuthToken, clearAuthToken } from "@/api/client";
import type { User } from "@/api/types";

const DEV_BYPASS = true; // ← flip to false when backend is connected

// ---- Context ----

interface AuthContextValue {
  /** Current authenticated user (null while loading or unauthenticated) */
  user: User | null;
  /** Whether we're still checking auth status */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Persist JWT and refetch current user */
  login: (token: string) => void;
  /** Remove JWT and clear user state */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, refetch } = useCurrentUser();

  const login = useCallback(
    (token: string) => {
      setAuthToken(token);
      refetch();
    },
    [refetch]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    refetch();
  }, [refetch]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: DEV_BYPASS ? false : isLoading,
      isAuthenticated: DEV_BYPASS ? true : !!user,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ---- Route Guard ----

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
