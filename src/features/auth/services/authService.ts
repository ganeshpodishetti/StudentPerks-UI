/**
 * authService – all authentication operations.
 *
 * Delegates HTTP calls to authApi / usersApi; keeps session state cookie-based
 * and the changePassword endpoint that was previously missing.
 */
import { setRefreshTokenFn, resetRefreshDisabled } from '@/shared/services/api/apiClient';
import { authApi } from '@/shared/services/api/authApi';
import { usersApi } from '@/shared/services/api/usersApi';
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
    ForgotPasswordResponse, GetUserResponse, LoginResponse,
    RegisterResponse, ResetPasswordResponse
} from '@/shared/types/api/responses';

// Re-export for consumers that import types from this module
export type { LoginRequest, RegisterRequest };
export type UserProfile = CurrentUserResponse;
export type UserItem = GetUserResponse;

export const authService = {
  // ── Profile helpers ────────────────────────────────────────────────────────

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      return await authApi.getMe();
    } catch {
      return null;
    }
  },

  getUser(): UserProfile | null {
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser(_user: UserProfile): void {
    // Session lives in HttpOnly cookies; user profile is kept in memory only.
  },

  clearUser(): void {
    // No-op: no local/session storage is used for auth state.
  },

  // ── Auth operations ────────────────────────────────────────────────────────

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await authApi.login(loginData);
    resetRefreshDisabled();
    return response;
  },

  async register(registerData: RegisterRequest): Promise<RegisterResponse> {
    return authApi.register(registerData);
  },

  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } finally {
      this.clearUser();
      resetRefreshDisabled();
    }
  },

  /**
   * POST /api/auth/refresh-token
   * Contract: NoBody – refresh cookie is sent automatically via withCredentials.
   */
  async refreshToken(): Promise<void> {
    await authApi.refreshToken();
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      await authApi.getMe();
      return true;
    } catch {
      return false;
    }
  },

  // ── Password operations ────────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return authApi.forgotPassword({ email } as ForgotPasswordRequest);
  },

  async validateResetToken(token: string): Promise<{ message: string }> {
    return authApi.validateResetToken(token);
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<ResetPasswordResponse> {
    return authApi.resetPassword(token, {
      newPassword,
      confirmNewPassword,
    } as ResetPasswordRequest);
  },

  /** POST /api/auth/change-password (was missing – now added) */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return authApi.changePassword(data);
  },

  // ── Email confirmation ─────────────────────────────────────────────────────

  async confirmEmail(token: string): Promise<{ message: string }> {
    return authApi.confirmEmail(token);
  },

  async resendConfirmationEmail(
    email: string,
  ): Promise<{ message: string }> {
    return authApi.sendConfirmationEmail({ email } as SendConfirmationEmailRequest);
  },

  // ── Refresh token validation ────────────────────────────────────────────────

  async validateRefreshToken(): Promise<{ message: string }> {
    return authApi.validateRefreshToken();
  },

  // ── User management (SuperAdmin) ───────────────────────────────────────────

  async getAllUsers(): Promise<UserItem[]> {
    return usersApi.getAll();
  },

  async deleteUser(userId: string): Promise<void> {
    return usersApi.deleteById(userId);
  },

  /** DELETE /api/users – delete own account */
  async deleteAccount(): Promise<void> {
    await usersApi.deleteSelf();
    this.clearUser();
  },
};

// Register the refresh function so the apiClient interceptor can call it
// without a circular import.
setRefreshTokenFn(() => authService.refreshToken());

