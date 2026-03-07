import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import apiService, { User } from './api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      const token = apiService.getAuthToken();
      if (token) {
        setIsAuthenticated(true);
        setUser(apiService.getUser());
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
        localStorage.setItem('replycraft_user', JSON.stringify(response.user));
        setUser(response.user);
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
        localStorage.setItem('replycraft_user', JSON.stringify(response.user));
        setUser(response.user);
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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
