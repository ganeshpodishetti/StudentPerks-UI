/**
 * Unified API error normalizer.
 *
 * Handles every error shape the ASP.NET backend may return:
 *  – ValidationProblem  { errors: { FieldName: ["msg", …] } }
 *  – ProblemDetails     { title, detail, status, errorCode?, errors? }
 *  – Custom objects     { error: string } | { message: string }
 *  – Plain string body
 *  – 5xx / network failures  →  always a safe generic fallback
 */

export interface NormalizedError {
  /** HTTP status code when available */
  status?: number;
  /** Machine-readable code from backend `errorCode` / `code` field */
  code?: string;
  /** Human-readable message safe to display in the UI */
  message: string;
  /** Per-field validation errors; keys are camelCase field names */
  fieldErrors?: Record<string, string[]>;
}

// ─── Generic status messages (used as fallback) ──────────────────────────────

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'You are not authenticated. Please log in.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'Validation failed. Please check your input.',
};

function genericMessage(status?: number): string {
  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  return 'An unexpected error occurred. Please try again.';
}

// ─── Main normalizer ─────────────────────────────────────────────────────────

export function normalizeApiError(error: unknown): NormalizedError {
  if (!error || typeof error !== 'object') {
    return { message: 'An unexpected error occurred. Please try again.' };
  }

  const err = error as { response?: { status?: number; data?: unknown }; message?: string };

  // Network / CORS / offline – no response object
  if (!err.response) {
    const msg: string =
      typeof err.message === 'string' && err.message.toLowerCase().includes('network')
        ? 'Unable to reach the server. Please check your connection.'
        : 'An unexpected error occurred. Please try again.';
    return { message: msg };
  }

  const status: number = err.response.status as number;
  const data: unknown = err.response.data;

  // ── 5xx – never leak server internals ──────────────────────────────────────
  if (status >= 500) {
    return { status, message: 'A server error occurred. Please try again later.' };
  }

  // ── No body ────────────────────────────────────────────────────────────────
  if (data === undefined || data === null || data === '') {
    return { status, message: genericMessage(status) };
  }

  // ── Plain string body ──────────────────────────────────────────────────────
  if (typeof data === 'string') {
    return { status, message: (data as string).trim() || genericMessage(status) };
  }

  if (typeof data !== 'object' || Array.isArray(data)) {
    return { status, message: genericMessage(status) };
  }

  const body = data as { errorCode?: unknown; code?: unknown; errors?: unknown; detail?: unknown; message?: unknown; error?: unknown; title?: unknown };

  // ── Optional machine-readable code ─────────────────────────────────────────
  const code: string | undefined = typeof body.errorCode === 'string' ? body.errorCode : typeof body.code === 'string' ? body.code : undefined;

  // ── Build fieldErrors from ValidationProblem / ProblemDetails.errors ───────
  let fieldErrors: Record<string, string[]> | undefined;

  if (body.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
    const fe: Record<string, string[]> = {};

    for (const [rawKey, rawVal] of Object.entries(body.errors as Record<string, unknown>)) {
      // ASP.NET uses PascalCase field names – normalise to camelCase for React forms
      const key = rawKey.charAt(0).toLowerCase() + rawKey.slice(1);
      const msgs: string[] = Array.isArray(rawVal)
        ? (rawVal as unknown[]).map(String)
        : [String(rawVal)];
      fe[key] = msgs;
    }

    if (Object.keys(fe).length > 0) fieldErrors = fe;
  }

  // ── Build display message (priority order matches backend conventions) ──────
  let message: string =
    (typeof body.detail === 'string' ? body.detail : '') ||
    (typeof body.message === 'string' ? body.message : '') ||
    (typeof body.error === 'string' ? body.error : '') ||
    (typeof body.title === 'string' ? body.title : '') ||
    '';

  // Summarise field errors when there is no top-level message
  if (!message && fieldErrors) {
    message = Object.values(fieldErrors).flat().join(' ');
  }

  if (!message) message = genericMessage(status);

  return {
    status,
    ...(code ? { code } : {}),
    message: String(message),
    ...(fieldErrors ? { fieldErrors } : {}),
  };
}

