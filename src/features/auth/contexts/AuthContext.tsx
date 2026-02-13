'use client'
import { authService } from '@/features/auth/services/authService';
import { User } from '@/shared/types/entities/user';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Try to refresh token and get user profile
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        
        if (isAuthenticated) {
          // If refresh token is valid, fetch user profile using public client to avoid interceptor
          const userProfile = await authService.getUserProfile(true);
          
          if (userProfile) {
            authService.setUser(userProfile);
            setUser(userProfile);
          } else {
            // If we can't get user profile, clear everything
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          // Refresh token invalid, clear user data
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (authError) {
        // If auth check fails (e.g., refresh token invalid), clear user data
        console.error('AuthContext: Auth verification failed:', authError);
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('AuthContext: Auth status check failed:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always perform auth check on mount
    // This will validate refresh token and auto-login if valid
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      // After successful login, get user data from localStorage (set by authService)
      const userData = authService.getUser();
      console.log('AuthContext: User data after login:', userData);
      
      if (userData) {
        setUser(userData);
      } else {
        // If still no user data, something went wrong
        throw new Error('Failed to retrieve user data after login');
      }
      
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      localStorage.removeItem('user');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    // After registration, you might want to automatically log in the user
    // or redirect them to login page - this depends on your backend behavior
    return response;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
