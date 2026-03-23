import { getApiBaseUrl } from '@/shared/config/env';
import { browserConsole } from '@/shared/utils/runtimeSafety';
import axios, { AxiosInstance } from 'axios';

// Lazy import avoids a circular-dep: authService imports apiClient
let _refreshTokenFn: (() => Promise<void>) | null = null;
export const setRefreshTokenFn = (fn: () => Promise<void>) => {
  _refreshTokenFn = fn;
};

if (process.env.NODE_ENV !== 'production' && !getApiBaseUrl()) {
  browserConsole.warn('API base URL is empty. Using same-origin /api proxy routes.');
}

// ─── Refresh-queue machinery ─────────────────────────────────────────────────

let isRefreshing = false;
let refreshDisabled = false;
export const resetRefreshDisabled = () => {
  refreshDisabled = false;
};

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

// ─── Factory ─────────────────────────────────────────────────────────────────

const createApiClient = (isPublic = false): AxiosInstance => {
  const apiBaseUrl = getApiBaseUrl();

  const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true, // always include cookies
    headers: { 'Content-Type': 'application/json' },
  });

  if (!isPublic) {
    // Auth-protected client: handle 401 refresh
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const skipAuthRefresh = Boolean(
          (originalRequest as { skipAuthRefresh?: boolean } | undefined)?.skipAuthRefresh,
        );
        const skipAuthRedirect = Boolean(
          (originalRequest as { skipAuthRedirect?: boolean } | undefined)?.skipAuthRedirect,
        );

        if (skipAuthRefresh) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && refreshDisabled) {
          if (!skipAuthRedirect && typeof window !== 'undefined') {
            const authPaths = [
              '/login', '/auth/login', '/register', '/forgot-password',
              '/reset-password', '/resend-confirmation', '/confirm-email', '/auth',
            ];
            const onAuthPage = authPaths.some((p) => window.location.pathname.startsWith(p));
            if (!onAuthPage) window.location.href = '/auth/login';
          }

          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => instance(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            if (_refreshTokenFn) {
              await _refreshTokenFn();
            } else {
              // Fallback: call refresh endpoint directly to avoid circular dep
              await publicApiClient.post('/api/auth/refresh-token');
            }

            refreshDisabled = false;
            processQueue();
            return instance(originalRequest);
          } catch (refreshError) {
            refreshDisabled = true;
            processQueue(refreshError);
            if (!skipAuthRedirect && typeof window !== 'undefined') {
              const authPaths = [
                '/login', '/auth/login', '/register', '/forgot-password',
                '/reset-password', '/resend-confirmation', '/confirm-email', '/auth',
              ];
              const onAuthPage = authPaths.some((p) =>
                window.location.pathname.startsWith(p),
              );
              if (!onAuthPage) window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  } else {
    // Public client: suppress network/CORS errors in production
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // In production browser, silently reject without console logging
        // Callers use Promise.allSettled or try/catch to handle gracefully
        return Promise.reject(error);
      },
    );
  }

  return instance;
};

export const apiClient = createApiClient();
export const publicApiClient = createApiClient(true);

// ─── FormData builder (used by universities) ─────────────────────────────────

/**
 * Converts a plain object to FormData.
 * File fields are appended as-is; booleans are serialised as "true"/"false";
 * undefined / null values are omitted.
 */
export function buildFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      fd.append(key, value);
    } else if (typeof value === 'boolean') {
      fd.append(key, value ? 'true' : 'false');
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}
