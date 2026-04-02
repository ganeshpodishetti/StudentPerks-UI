import { browserConsole } from '@/shared/utils/runtimeSafety';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  errorType: 'javascript' | 'api' | 'network' | 'validation' | 'boundary';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
}

interface ErrorReportingConfig {
  enabled: boolean;
  endpoint?: string;
  maxReports: number;
  throttleMs: number;
  enableConsoleLogging: boolean;
}

/**
 * Enhanced error reporting service for better error tracking and debugging
 */
class ErrorReportingService {
  private config: ErrorReportingConfig;
  private reportQueue: ErrorReport[] = [];
  private lastReportTime = 0;
  private sessionId: string;
  private static fallbackSessionCounter = 0;

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      maxReports: 50,
      throttleMs: 1000,
      enableConsoleLogging: process.env.NEXT_PUBLIC_ENABLE_ERROR_CONSOLE === 'true',
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    const timestamp = Date.now();
    const cryptoObj = globalThis.crypto;

    if (cryptoObj?.randomUUID) {
      return `${timestamp}-${cryptoObj.randomUUID()}`;
    }

    if (cryptoObj?.getRandomValues) {
      const randomBytes = new Uint8Array(16);
      cryptoObj.getRandomValues(randomBytes);
      const randomHex = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
      return `${timestamp}-${randomHex}`;
    }

    ErrorReportingService.fallbackSessionCounter += 1;
    return `${timestamp}-fallback-${ErrorReportingService.fallbackSessionCounter}`;
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        errorType: 'javascript',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason as Error | undefined;
      this.reportError({
        message: reason?.message || 'Unhandled Promise Rejection',
        stack: reason?.stack,
        errorType: 'javascript',
        severity: 'high',
        context: {
          reason: event.reason,
        },
      });
    });
  }

  reportError(error: {
    message: string;
    stack?: string;
    errorType: ErrorReport['errorType'];
    severity: ErrorReport['severity'];
    context?: Record<string, unknown>;
    userId?: string;
  }): void {
    if (!this.config.enabled) {
      if (this.config.enableConsoleLogging) {
        browserConsole.error('Error reported:', error);
      }
      return;
    }

    const now = Date.now();
    if (now - this.lastReportTime < this.config.throttleMs) {
      return;
    }
    this.lastReportTime = now;

    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      userId: error.userId,
      sessionId: this.sessionId,
      errorType: error.errorType,
      severity: error.severity,
      context: error.context,
    };

    this.addToQueue(report);
    this.processQueue();

    if (this.config.enableConsoleLogging) {
      browserConsole.error('Error reported:', report);
    }
  }

  reportApiError(error: unknown, context: {
    endpoint: string;
    method: string;
    status?: number;
    requestData?: unknown;
  }): void {
    const sanitizedContext = {
      endpoint: context.endpoint,
      method: context.method,
      status: context.status,
    };
    this.reportError({
      message: (error as Error)?.message || 'API Error',
      stack: (error as Error)?.stack,
      errorType: 'api',
      severity: this.getApiErrorSeverity(context.status),
      context: sanitizedContext,
    });
  }

  reportNetworkError(error: unknown, context?: Record<string, unknown>): void {
    const sanitizedContext = context ? {
      url: typeof context.url === 'string' ? context.url : undefined,
      method: typeof context.method === 'string' ? context.method : undefined,
    } : undefined;
    this.reportError({
      message: (error as Error)?.message || 'Network Error',
      stack: (error as Error)?.stack,
      errorType: 'network',
      severity: 'medium',
      context: sanitizedContext,
    });
  }

  reportValidationError(message: string, context?: Record<string, unknown>): void {
    this.reportError({
      message,
      errorType: 'validation',
      severity: 'low',
      context,
    });
  }

  reportBoundaryError(error: Error, errorInfo: string, context?: Record<string, unknown>): void {
    this.reportError({
      message: error.message,
      stack: error.stack,
      errorType: 'boundary',
      severity: 'critical',
      context: {
        errorInfo,
        ...context,
      },
    });
  }

  private getApiErrorSeverity(status?: number): ErrorReport['severity'] {
    if (!status) return 'medium';
    if (status >= 500) return 'high';
    if (status >= 400) return 'medium';
    return 'low';
  }

  private addToQueue(report: ErrorReport): void {
    this.reportQueue.push(report);
    
    if (this.reportQueue.length > this.config.maxReports) {
      this.reportQueue = this.reportQueue.slice(-this.config.maxReports);
    }
  }

  private async processQueue(): Promise<void> {
    if (!this.config.endpoint || this.reportQueue.length === 0) {
      return;
    }

    const reportsToSend = [...this.reportQueue];
    this.reportQueue = [];

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reports: reportsToSend }),
      });
    } catch (error: unknown) {
      this.reportQueue.unshift(...reportsToSend);
      browserConsole.warn('Failed to send error reports:', error);
    }
  }

  getErrorStats(): {
    queueSize: number;
    sessionId: string;
    totalReported: number;
  } {
    return {
      queueSize: this.reportQueue.length,
      sessionId: this.sessionId,
      totalReported: 0,
    };
  }

  clearQueue(): void {
    this.reportQueue = [];
  }

  updateConfig(newConfig: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const errorReportingService = new ErrorReportingService();

export type { ErrorReport, ErrorReportingConfig };
