'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import { ensureClientContext } from '@/shared/utils/runtimeSafety';
import { normalizeApiError } from '@/shared/utils/normalizeApiError';
import { createContext, ReactNode, useCallback, useContext } from 'react';
import { errorReportingService } from '../services/errorReportingService';

interface ErrorContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  /** Normalises any API error and shows an appropriate toast. */
  handleApiError: (error: unknown, context?: { endpoint?: string; method?: string }) => void;
  handleNetworkError: (error: unknown, context?: Record<string, unknown>) => void;
  handleValidationError: (message: string, context?: Record<string, unknown>) => void;
  handleBoundaryError: (error: Error, errorInfo: string, context?: Record<string, unknown>) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const fallbackErrorContext: ErrorContextType = {
  showError: () => undefined,
  showSuccess: () => undefined,
  showWarning: () => undefined,
  showInfo: () => undefined,
  handleApiError: () => undefined,
  handleNetworkError: () => undefined,
  handleValidationError: () => undefined,
  handleBoundaryError: () => undefined,
};

export const useErrorHandler = () => {
  return ensureClientContext(
    useContext(ErrorContext),
    fallbackErrorContext,
    'useErrorHandler must be used within an ErrorProvider',
  );
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const showError = useCallback(
    (message: string, title = 'Error') => {
      toast({ title, description: message, variant: 'destructive' });
    },
    [toast],
  );

  const showSuccess = useCallback(
    (message: string, title = 'Success') => {
      toast({ title, description: message });
    },
    [toast],
  );

  const showWarning = useCallback(
    (message: string, title = 'Warning') => {
      toast({ title, description: message, variant: 'destructive' });
    },
    [toast],
  );

  const showInfo = useCallback(
    (message: string, title = 'Info') => {
      toast({ title, description: message, variant: 'default' });
    },
    [toast],
  );

  const handleApiError = useCallback(
    (error: unknown, context?: { endpoint?: string; method?: string }) => {
      // Report for observability
      errorReportingService.reportApiError(error, {
        endpoint: context?.endpoint ?? '',
        method: context?.method ?? '',
        status: (error as { response?: { status?: number } })?.response?.status,
        requestData: (error as { config?: { data?: unknown } })?.config?.data,
      });

      const { status, message, fieldErrors } = normalizeApiError(error);

      // ── Status-driven decisions ─────────────────────────────────────────────
      // 401 / 403: always show a safe frontend message (don't leak backend detail)
      if (status === 401) {
        showError('Please log in again to continue.', 'Authentication Required');
        return;
      }
      if (status === 403) {
        showError("You don't have permission to perform this action.", 'Access Denied');
        return;
      }
      // 5xx: generic – already handled by normalizeApiError, but guard here too
      if (!status || status >= 500) {
        showError('A server error occurred. Please try again later.', 'Server Error');
        return;
      }

      // ── Field-level validation summary ─────────────────────────────────────
      if (fieldErrors) {
        const summary = Object.values(fieldErrors).flat().join(' ');
        showError(summary || message, 'Validation Error');
        return;
      }

      // ── Safe backend message (400/404/409/422 etc.) ─────────────────────────
      showError(message);
    },
    [showError],
  );

  const handleNetworkError = useCallback(
    (error: unknown, context?: Record<string, unknown>) => {
      errorReportingService.reportNetworkError(error, context);
      showError('Please check your internet connection and try again.', 'Connection Error');
    },
    [showError],
  );

  const handleValidationError = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      errorReportingService.reportValidationError(message, context);
      showError(message, 'Validation Error');
    },
    [showError],
  );

  const handleBoundaryError = useCallback(
    (error: Error, errorInfo: string, context?: Record<string, unknown>) => {
      errorReportingService.reportBoundaryError(error, errorInfo, context);
      showError('An unexpected error occurred. The page will be refreshed.', 'Application Error');
    },
    [showError],
  );

  const value: ErrorContextType = {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    handleApiError,
    handleNetworkError,
    handleValidationError,
    handleBoundaryError,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};
