import { authService } from '@/features/auth/services/authService';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
  // Warning: NEXT_PUBLIC_API_URL is not defined in production. Using fallback URL which may not work correctly.
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

const createApiClient = (isPublic = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Always send cookies with requests
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!isPublic) {
    // Response interceptor to handle 401 errors and token refresh
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized) by attempting token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                // Retry the original request after refresh completes
                return instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Attempt to refresh the token (cookies will be updated automatically)
            await authService.refreshToken();
            processQueue();
            // Retry the original request with new cookies
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            // Clear user data on refresh failure
            localStorage.removeItem('user');
            
            // Only redirect if not already on login or auth pages
            if (typeof window !== 'undefined') {
              const pathname = window.location.pathname;
              const isAuthPage = pathname.includes('/login') ||
                                 pathname.includes('/register') ||
                                 pathname.includes('/forgot-password') ||
                                 pathname.includes('/reset-password') ||
                                 pathname.includes('/resend-confirmation') ||
                                 pathname.includes('/confirm-email');
              
              if (!isAuthPage) {
                window.location.href = '/login';
              }
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return instance;
};

export const apiClient = createApiClient();
export const publicApiClient = createApiClient(true);

export default apiClient;