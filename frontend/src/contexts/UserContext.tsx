import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useProfile } from "@/api/hooks";

interface UserContextData {
  avatarUrl: string;
  plan: string;
  email: string;
  fullName: string;
}

interface UserContextValue {
  user: UserContextData;
  setAvatarUrl: (url: string) => void;
  updateUser: (data: Partial<UserContextData>) => void;
}

// Fallback values used only when API has not responded yet
const fallbackUser: UserContextData = {
  avatarUrl: "",
  plan: "",
  email: "",
  fullName: "",
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextData>(fallbackUser);
  const { data: profile } = useProfile();

  // Sync context with API profile data
  useEffect(() => {
    if (profile) {
      setUser((prev) => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        email: profile.email || prev.email,
        plan: profile.plan || prev.plan,
        avatarUrl: profile.avatarUrl || prev.avatarUrl,
      }));
    }
  }, [profile]);

  const setAvatarUrl = useCallback((url: string) => {
    setUser((prev) => ({ ...prev, avatarUrl: url }));
  }, []);

  const updateUser = useCallback((data: Partial<UserContextData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <UserContext.Provider value={{ user, setAvatarUrl, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
