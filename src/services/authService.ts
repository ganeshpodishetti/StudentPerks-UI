// authService.ts
import { getTimeUntilExpiration, isTokenExpired } from '@/lib/tokenUtils';
import { apiClient } from './apiClient'; // Use shared apiClient
import { clearGlobalTokenManager, getGlobalTokenManager } from './tokenManager';

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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

let currentAccessToken: string | null = null;

export const authService = {
  setAccessToken(token: string) {
    currentAccessToken = token;
    localStorage.setItem('accessToken', token);
    this.scheduleProactiveRefresh();
  },

  getAccessToken(): string | null {
    if (!currentAccessToken) {
      currentAccessToken = localStorage.getItem('accessToken');
    }
    return currentAccessToken;
  },

  clearAccessToken() {
    currentAccessToken = null;
    localStorage.removeItem('accessToken');
    this.clearProactiveRefresh();
  },

  scheduleProactiveRefresh() {
    try {
      const tokenManager = getGlobalTokenManager(
        async () => {
          await this.refreshToken();
        },
        () => this.getAccessToken()
      );
      tokenManager.scheduleProactiveRefresh();
    } catch (_error) {
      // Silent fail for production, optionally log to remote error service
    }
  },

  clearProactiveRefresh() {
    try {
      clearGlobalTokenManager();
    } catch (_error) {
      // Silent fail for production, optionally log to remote error service
    }
  },

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/api/auth/login', loginData);
    const responseData = response.data;

    if (responseData.accessToken) {
      this.setAccessToken(responseData.accessToken);
    }

    if (responseData.id && responseData.firstName && responseData.lastName && responseData.email) {
      const userData = {
        id: responseData.id,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        email: responseData.email,
      };
      this.setUser(userData);
    }

    return responseData;
  },

  async register(registerData: RegisterRequest) {
    const response = await apiClient.post('/api/auth/register', registerData);
    return response.data;
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/api/auth/refresh-token', {}, {
        withCredentials: true,
      });
      const { accessToken } = response.data;

      if (accessToken) {
        this.setAccessToken(accessToken);
        return accessToken;
      }

      throw new Error('No access token received from refresh endpoint');
    } catch (error: any) {
      this.clearAccessToken();
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Refresh token invalid or expired');
      }
      if (error.response?.status === 400) {
        throw new Error('Refresh token expired or revoked');
      }
      throw error;
    }
  },

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    return isTokenExpired(token);
  },

  getTimeUntilTokenExpires(): number {
    const token = this.getAccessToken();
    if (!token) return 0;
    return getTimeUntilExpiration(token);
  },

  async checkAuthStatus(): Promise<boolean> {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
        return true;
      } catch (refreshError: any) {
        if (
          refreshError.message?.includes('invalid') ||
          refreshError.message?.includes('expired') ||
          refreshError.message?.includes('revoked')
        ) {
          this.clearAccessToken();
          localStorage.removeItem('user');
        }
        return false;
      }
    }

    return true;
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
      await apiClient.post('/api/auth/logout');
    } catch (_error) {
      // Silent fail for production, optionally log to remote error service
    } finally {
      this.clearAccessToken();
      localStorage.removeItem('user');
    }
  },

  getRefreshStatus() {
    try {
      const tokenManager = getGlobalTokenManager();
      return {
        isScheduled: tokenManager.isRefreshScheduled(),
        timeUntilRefresh: tokenManager.getTimeUntilRefresh(),
      };
    } catch {
      return {
        isScheduled: false,
        timeUntilRefresh: 0,
      };
    }
  },
};