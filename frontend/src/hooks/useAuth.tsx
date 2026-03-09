// ==========================================
// Auth Hook — Firebase + JWT token management + route protection
// ==========================================

import { createContext, useContext, useCallback, useMemo, useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/api/hooks";
import { setAuthToken, clearAuthToken, setFirebaseToken, clearFirebaseToken, getFirebaseToken, apiClient } from "@/api/client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import type { User } from "@/api/types";

// DEV_BYPASS: When true, authentication is not enforced so the UI
// remains navigable during development without a running backend.
// Set to false once your backend and Firebase are configured.

const DEV_BYPASS = false; // ← flip to false when backend is connected

// ---- Context ----

interface AuthContextValue {
  /** Current authenticated user (null while loading or unauthenticated) */
  user: User | null;
  /** Whether we're still checking auth status */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Firebase user (if using Firebase auth) */
  firebaseUser: FirebaseUser | null;
  /** Persist Firebase token and refetch current user */
  login: (token: string) => void;
  /** Remove JWT and Firebase tokens and clear user state */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading: isUserLoading, refetch } = useCurrentUser();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    if (!auth) {
      setIsCheckingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          // Get fresh ID token
          const idToken = await fbUser.getIdToken();
          setFirebaseToken(idToken);
        } catch (e) {
          console.error('Error getting Firebase token:', e);
        }
      } else {
        setFirebaseUser(null);
        clearFirebaseToken();
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    (token: string) => {
      setAuthToken(token);
      refetch();
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    // Sign out from Firebase
    if (auth) {
      try {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      } catch (e) {
        console.log('Firebase signout error (can be ignored):', e);
      }
    }
    
    clearAuthToken();
    clearFirebaseToken();
    
    // Don't refetch - just clear state
    window.location.href = '/login';
  }, []);

  const isLoading = isUserLoading || isCheckingAuth;
  const isAuth = DEV_BYPASS || !!user || !!firebaseUser;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: DEV_BYPASS ? false : isLoading,
      isAuthenticated: isAuth,
      firebaseUser,
      login,
      logout,
    }),
    [user, isLoading, isAuth, firebaseUser, login, logout]
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
