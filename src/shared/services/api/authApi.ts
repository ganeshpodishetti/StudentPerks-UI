/**
 * authApi – typed wrappers for every /api/auth endpoint.
 *
 * These are thin HTTP layers; they return the response data directly.
 * All errors propagate as axios errors; callers should use normalizeApiError.
 */

import type {
    ChangePasswordRequest,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    SendConfirmationEmailRequest
} from '@/shared/types/api/requests';
import type {
    ChangePasswordResponse,
    CurrentUserResponse,
    ForgotPasswordResponse,
    LoginResponse,
    RefreshTokenResponse,
    RegisterResponse,
    ResetPasswordResponse
} from '@/shared/types/api/responses';
import { apiClient, publicApiClient } from './apiClient';

export const authApi = {
  /** POST /api/auth/login  – sets accessToken / refreshToken cookies */
  login: (data: LoginRequest) =>
    publicApiClient
      .post<LoginResponse>('/api/auth/login', data)
      .then((r) => r.data),

  /** POST /api/auth/register */
  register: (data: RegisterRequest) =>
    publicApiClient
      .post<RegisterResponse>('/api/auth/register', data)
      .then((r) => r.data),

  /**
   * POST /api/auth/refresh-token
   * Contract: NO request body – refresh cookie is sent automatically.
   */
  refreshToken: () =>
    publicApiClient
      .post<RefreshTokenResponse>('/api/auth/refresh-token')
      .then((r) => r.data),

  /** POST /api/auth/logout (auth required) */
  logout: () =>
    apiClient
      .post<{ message: string }>('/api/auth/logout')
      .then((r) => r.data),

  /** GET /api/auth/me (auth required) */
  getMe: () =>
    apiClient
      .get<CurrentUserResponse>(
        '/api/auth/me',
        { skipAuthRedirect: true } as import('axios').AxiosRequestConfig,
      )
      .then((r) => r.data),

  /** POST /api/auth/change-password (auth required) */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient
      .post<ChangePasswordResponse>('/api/auth/change-password', data)
      .then((r) => r.data),

  /** POST /api/auth/forgot-password */
  forgotPassword: (data: ForgotPasswordRequest) =>
    publicApiClient
      .post<ForgotPasswordResponse>('/api/auth/forgot-password', data)
      .then((r) => r.data),

  /**
   * POST /api/auth/reset-password?token=...
   * Token is passed as a query parameter per backend contract.
   */
  resetPassword: (token: string, data: ResetPasswordRequest) =>
    publicApiClient
      .post<ResetPasswordResponse>(
        `/api/auth/reset-password?token=${encodeURIComponent(token)}`,
        data,
      )
      .then((r) => r.data),

  /** GET /api/auth/confirm-email?token=... */
  confirmEmail: (token: string) =>
    publicApiClient
      .get<{ message: string }>(
        `/api/auth/confirm-email?token=${encodeURIComponent(token)}`,
      )
      .then((r) => r.data),

  /** POST /api/auth/send-confirmation-email */
  sendConfirmationEmail: (data: SendConfirmationEmailRequest) =>
    publicApiClient
      .post<{ message: string }>('/api/auth/send-confirmation-email', data)
      .then((r) => r.data),

  /** GET /api/auth/validate-refresh-token */
  validateRefreshToken: () =>
    publicApiClient
      .get<{ message: string }>('/api/auth/validate-refresh-token')
      .then((r) => r.data),

  /** GET /api/auth/validate-reset-token?token=... */
  validateResetToken: (token: string) =>
    publicApiClient
      .get<{ message: string }>(
        `/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
      )
      .then((r) => r.data),
};

