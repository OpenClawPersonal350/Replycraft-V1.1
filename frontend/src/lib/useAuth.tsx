import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import apiService, { User } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Extended user type with name from profile
interface UserWithName extends User {
  name?: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithName | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch profile data from backend to get name and avatarUrl
  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        const currentUser = apiService.getUser() || {};
        // Merge profile data with existing user data
        const updatedUser = {
          ...currentUser,
          name: response.name || currentUser.name,
          avatarUrl: response.avatarUrl || currentUser.avatarUrl,
        };
        localStorage.setItem('replycraft_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        setIsAuthenticated(true);
        // Fetch profile to get name and avatarUrl from backend
        await fetchProfile();
        setUser(apiService.getUser() as UserWithName);
      }
      setIsLoading(false);
    };
    initAuth();

    const handleProfileUpdate = () => {
      setUser(apiService.getUser());
    };
    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('user_profile_updated', handleProfileUpdate);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.token) {
        localStorage.setItem('replycraft_token', response.token);
        
        // Fetch profile to get name from backend
        const profile = await fetchProfile();
        
        // Merge user data with profile data
        const userData = {
          ...response.user,
          name: profile?.name || response.user?.name || email.split('@')[0],
          avatarUrl: profile?.avatarUrl || response.user?.avatarUrl,
        };
        
        localStorage.setItem('replycraft_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register(name, email, password);
      if (response.success && response.token) {
        localStorage.setItem('replycraft_token', response.token);
        
        // Fetch profile to get name from backend
        const profile = await fetchProfile();
        
        // Merge user data with profile data  
        const userData = {
          ...response.user,
          name: profile?.name || name || email.split('@')[0],
          avatarUrl: profile?.avatarUrl || response.user?.avatarUrl,
        };
        
        localStorage.setItem('replycraft_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        const currentUser = apiService.getUser() || {};
        const updatedUser = {
          ...currentUser,
          name: response.name || currentUser.name,
          avatarUrl: response.avatarUrl || currentUser.avatarUrl,
        };
        localStorage.setItem('replycraft_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
