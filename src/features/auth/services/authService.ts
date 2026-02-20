// authService.ts
import { apiClient, publicApiClient } from '@/shared/services/api/apiClient'; // Use shared apiClient

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
  async getUserProfile(usePublicClient: boolean = false): Promise<UserProfile | null> {
    try {
      const client = usePublicClient ? publicApiClient : apiClient;
      const response = await client.get('/api/auth/me', {
        withCredentials: true,
      });
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
    
    if (userProfile) {
      this.setUser(userProfile);
    }

    return responseData;
  },

  async register(registerData: RegisterRequest) {
    const response = await apiClient.post('/api/auth/register', registerData, {
      withCredentials: true,
    });
    return response.data;
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/forgot-password',
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async validateResetToken(token: string): Promise<{ message: string }> {
    const response = await apiClient.get(`/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string, confirmNewPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/api/auth/reset-password?token=${encodeURIComponent(token)}`,
      {
        newPassword,
        confirmNewPassword
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async refreshToken(): Promise<void> {
    try {
      // Use publicApiClient to avoid the 401 interceptor loop
      await publicApiClient.post('/api/auth/refresh-token', {}, {
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