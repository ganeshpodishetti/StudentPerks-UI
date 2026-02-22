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

  // Define public routes that don't require auth check (no need to check if user is already logged in)
  const isPublicRoute = (pathname: string): boolean => {
    const publicPaths = [
      '/', // homepage
      '/categories',
      '/stores',
      '/universities',
      '/login', // login page - redirect handled in the page component
      // NOTE: register and other auth pages may need redirect handling too
    ];
    return publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  };

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Skip auth check on public routes to avoid unnecessary refresh token calls
      if (typeof window !== 'undefined' && isPublicRoute(window.location.pathname)) {
        setIsLoading(false);
        return;
      }
      
      // Check if user already exists in localStorage (e.g., after just logging in)
      const existingUser = authService.getUser();
      
      // If user exists in localStorage, set them in state immediately
      if (existingUser) {
        setUser(existingUser);
      }
      
      // Try to refresh token and verify authentication
      try {
        const isAuthenticated = await authService.checkAuthStatus();
        
        if (isAuthenticated) {
          // If refresh token is valid, fetch user profile using public client
          const userProfile = await authService.getUserProfile(true);
          
          if (userProfile) {
            authService.setUser(userProfile);
            setUser(userProfile);
          }
        } else if (!existingUser) {
          // Only clear if there was no existing user
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (authError) {
        // If auth check fails but we have an existing user, keep them logged in
        if (!existingUser) {
          console.error('AuthContext: Auth verification failed:', authError);
          setUser(null);
          localStorage.removeItem('user');
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login({ email, password });
      
      // After successful login, get user data from localStorage
      const userData = authService.getUser();
      
      if (userData) {
        setUser(userData);
      } else {
        // If no user data in localStorage, try to fetch profile
        try {
          const userProfile = await authService.getUserProfile(true);
          if (userProfile) {
            authService.setUser(userProfile);
            setUser(userProfile);
          }
        } catch (profileError) {
          console.warn('Failed to fetch user profile after login:', profileError);
        }
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
