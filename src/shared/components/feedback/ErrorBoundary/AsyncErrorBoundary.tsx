'use client'

import { Component, ReactNode } from 'react';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

interface AsyncErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

/**
 * Enhanced error boundary specifically for async operations
 * Provides better error handling for React Query and async components
 */
export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || 'No stack trace available',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorString = errorInfo.componentStack || 'No component stack available';
    
    // Log error details
    console.error('AsyncErrorBoundary caught an error:', {
      error,
      errorInfo: errorString,
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorString);

    this.setState({
      hasError: true,
      error,
      errorInfo: errorString,
    });
  }

  componentDidUpdate(prevProps: AsyncErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state if resetKeys changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset on any prop change if enabled
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    // Clear any pending reset timeout
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleRetry = () => {
    this.resetErrorBoundary();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use default error boundary fallback
      return (
        <ErrorBoundaryFallback
          error={error}
          errorInfo={errorInfo}
          onRetry={this.handleRetry}
          title="Something went wrong with async operation"
          description="An error occurred while loading data. This might be a temporary issue."
        />
      );
    }

    return children;
  }
}

/**
 * Hook to manually trigger error boundary
 * Useful for async errors that don't automatically trigger error boundaries
 */
export const useAsyncError = () => {
  const throwError = (error: Error) => {
    // This will trigger the error boundary
    throw error;
  };

  return throwError;
};