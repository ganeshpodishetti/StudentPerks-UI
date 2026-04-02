export const isBrowser = typeof window !== 'undefined';
export const isBrowserProduction = isBrowser && process.env.NODE_ENV === 'production';

/**
 * Suppress all console logs, uncaught errors, and network errors in production browser.
 * This prevents potential exposure of sensitive information (like API endpoints, tokens 
 * in URLs, or details about backend structures) and keeps the console completely clean.
 */
export const suppressProductionLogsAndErrors = () => {
  if (!isBrowserProduction || typeof window === 'undefined') return;

  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
  console.debug = noop;

  // Do NOT suppress error/unhandledrejection events in production.
  // Error boundaries, error reporting service, and browser defaults
  // must remain active to catch and report real failures.
};

type ConsoleMethod = 'debug' | 'error' | 'info' | 'log' | 'warn';

const safeConsoleCall = (method: ConsoleMethod, ...args: unknown[]) => {
  if (isBrowserProduction || typeof console === 'undefined') {
    return;
  }

  console[method](...args);
};

export const browserConsole = {
  debug: (...args: unknown[]) => safeConsoleCall('debug', ...args),
  error: (...args: unknown[]) => safeConsoleCall('error', ...args),
  info: (...args: unknown[]) => safeConsoleCall('info', ...args),
  log: (...args: unknown[]) => safeConsoleCall('log', ...args),
  warn: (...args: unknown[]) => safeConsoleCall('warn', ...args),
};

export const ensureClientContext = <T>(
  value: T | null | undefined,
  fallback: T,
  message: string,
): T => {
  if (value !== null && value !== undefined) {
    return value;
  }

  if (process.env.NODE_ENV !== 'production') {
    throw new Error(message);
  }

  return fallback;
};
