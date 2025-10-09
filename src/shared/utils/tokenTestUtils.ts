import { authService } from '@/features/auth/services/authService';

export const tokenTestUtils = {
  // Create a token that will expire in specified seconds
  createShortLivedToken(expirationInSeconds: number = 60): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      sub: 'test-user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expirationInSeconds,
      userId: 'test-user-id',
      email: 'test@example.com'
    };

    // Create a fake JWT (this won't work with the backend, just for testing expiration logic)
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = 'fake-signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  // Get user info from authService
  getUserInfo(): {
    user: any;
    isAuthenticated: boolean;
  } {
    const user = authService.getUser();
    
    return {
      user,
      isAuthenticated: !!user
    };
  },

  // Check authentication status
  async checkAuth(): Promise<boolean> {
    return await authService.checkAuthStatus();
  }
};

// Make it available globally in development
// Only expose in development
if (process.env.NODE_ENV === 'development') {
  (window as any).tokenTestUtils = tokenTestUtils;
}
