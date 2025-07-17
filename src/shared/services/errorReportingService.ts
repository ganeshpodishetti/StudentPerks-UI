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
  context?: Record<string, any>;
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

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      maxReports: 50,
      throttleMs: 1000, // 1 second throttle
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Handle unhandled JavaScript errors
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

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        errorType: 'javascript',
        severity: 'high',
        context: {
          reason: event.reason,
        },
      });
    });
  }

  /**
   * Report an error with context
   */
  reportError(error: {
    message: string;
    stack?: string;
    errorType: ErrorReport['errorType'];
    severity: ErrorReport['severity'];
    context?: Record<string, any>;
    userId?: string;
  }): void {
    if (!this.config.enabled) {
      if (this.config.enableConsoleLogging) {
        console.error('Error reported:', error);
      }
      return;
    }

    // Throttle error reports
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
      console.error('Error reported:', report);
    }
  }

  /**
   * Report API errors with additional context
   */
  reportApiError(error: any, context: {
    endpoint: string;
    method: string;
    status?: number;
    requestData?: any;
  }): void {
    this.reportError({
      message: error.message || 'API Error',
      stack: error.stack,
      errorType: 'api',
      severity: this.getApiErrorSeverity(context.status),
      context: {
        endpoint: context.endpoint,
        method: context.method,
        status: context.status,
        requestData: context.requestData,
        responseData: error.response?.data,
      },
    });
  }

  /**
   * Report network errors
   */
  reportNetworkError(error: any, context?: Record<string, any>): void {
    this.reportError({
      message: error.message || 'Network Error',
      stack: error.stack,
      errorType: 'network',
      severity: 'medium',
      context,
    });
  }

  /**
   * Report validation errors
   */
  reportValidationError(message: string, context?: Record<string, any>): void {
    this.reportError({
      message,
      errorType: 'validation',
      severity: 'low',
      context,
    });
  }

  /**
   * Report React error boundary errors
   */
  reportBoundaryError(error: Error, errorInfo: string, context?: Record<string, any>): void {
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
    
    // Keep queue size manageable
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
    } catch (error) {
      // If sending fails, put reports back in queue (but don't report this error to avoid loops)
      this.reportQueue.unshift(...reportsToSend);
      console.warn('Failed to send error reports:', error);
    }
  }

  /**
   * Get current error statistics
   */
  getErrorStats(): {
    queueSize: number;
    sessionId: string;
    totalReported: number;
  } {
    return {
      queueSize: this.reportQueue.length,
      sessionId: this.sessionId,
      totalReported: 0, // Could be tracked if needed
    };
  }

  /**
   * Clear the error queue
   */
  clearQueue(): void {
    this.reportQueue = [];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const errorReportingService = new ErrorReportingService();

// Export types for use in other files
export type { ErrorReport, ErrorReportingConfig };