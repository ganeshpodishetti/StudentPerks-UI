// authService.ts
import { apiClient } from '@/shared/services/api/apiClient'; // Use shared apiClient

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error(
    "authService: process.env.NEXT_PUBLIC_API_URL is not defined. " +
    "Set it in your environment or `.env.local`."
  );
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  requiresMfa: boolean;
  lockoutEnd: string | null;
  message: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

export interface RefreshTokenResponse {
  message: string;
}

export const authService = {
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get('/api/auth/me', {
        withCredentials: true,
      });
      console.log('authService: User profile from API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  },

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/api/auth/login', loginData, {
      withCredentials: true,
    });
    const responseData = response.data;

    // Fetch user profile after successful login
    const userProfile = await this.getUserProfile();
    console.log('authService: Fetched user profile:', userProfile);
    
    if (userProfile) {
      this.setUser(userProfile);
      console.log('authService: User profile stored in localStorage');
    } else {
      console.error('authService: Failed to fetch user profile');
    }

    return responseData;
  },

  async register(registerData: RegisterRequest) {
    try {
      console.log('authService: Registering user with data:', registerData);
      const response = await apiClient.post('/api/auth/register', registerData, {
        withCredentials: true,
      });
      console.log('authService: Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('authService: Registration failed:', error);
      console.error('authService: Error response:', error.response?.data);
      throw error;
    }
  },

  async confirmEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.get(`/api/auth/confirm-email?token=${encodeURIComponent(token)}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async resendConfirmationEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/send-confirmation-email',
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async refreshToken(): Promise<void> {
    try {
      await apiClient.post('/api/auth/refresh-token', {}, {
        withCredentials: true,
      });
      // Tokens are now in HTTP-only cookies, no need to handle them here
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Refresh token invalid or expired');
      }
      if (error.response?.status === 400) {
        throw new Error('Refresh token expired or revoked');
      }
      throw error;
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      // Try to refresh the token to verify authentication
      await this.refreshToken();
      return true;
    } catch (refreshError: any) {
      if (
        refreshError.message?.includes('invalid') ||
        refreshError.message?.includes('expired') ||
        refreshError.message?.includes('revoked')
      ) {
        localStorage.removeItem('user');
      }
      return false;
    }
  },

  getUser() {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {}, {
        withCredentials: true,
      });
    } catch (_error) {
      // Silent fail for production, optionally log to remote error service
    } finally {
      localStorage.removeItem('user');
    }
  },
};