const normalizeEnv = (value: string | undefined): string => {
  let val = value?.trim().replace(/\/$/, '') ?? '';
  // Force HTTPS for production API to avoid extra redirects/logs
  if (val.includes('api.perkscrowd.com') && !val.startsWith('https://')) {
    val = val.replace(/^http:\/\//, 'https://');
  }
  return val;
};

// Prefer the new variable but keep NEXT_PUBLIC_API_URL as a fallback.
export const API_BASE_URL =
  normalizeEnv(process.env.NEXT_PUBLIC_API_BASE_URL) ||
  normalizeEnv(process.env.NEXT_PUBLIC_API_URL);

const isNetlifyPreviewHost = (hostname: string): boolean =>
  hostname.endsWith('.netlify.app');

/**
 * Netlify preview deploys should use same-origin `/api/*` proxy routes to preserve auth cookies.
 */
export const getApiBaseUrl = (hostnameOverride?: string): string => {
  const hostname = hostnameOverride ?? (typeof window !== 'undefined' ? window.location.hostname : undefined);

  if (hostname && isNetlifyPreviewHost(hostname)) {
    return '';
  }

  return API_BASE_URL;
};

export const GOOGLE_AUTH_PATH = '/api/auth/google';

export const getGoogleAuthUrl = (): string => `${getApiBaseUrl()}${GOOGLE_AUTH_PATH}`;


