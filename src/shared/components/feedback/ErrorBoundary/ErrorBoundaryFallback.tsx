'use client'

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryFallbackProps {
  error: Error | null;
  errorInfo?: string | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
  showErrorDetails?: boolean;
}

/**
 * Reusable fallback component for error boundaries
 * Provides consistent error UI across the application
 */
export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  errorInfo,
  onRetry,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  showErrorDetails = process.env.NODE_ENV === 'development',
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button 
              onClick={handleReload} 
              variant="outline"
              className="flex-1"
            >
              Reload Page
            </Button>
          </div>

          {showErrorDetails && error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Error Details
              </summary>
              <div className="mt-2 rounded-md bg-gray-50 p-3">
                <div className="text-sm">
                  <div className="font-medium text-red-800 mb-2">
                    {error.name}: {error.message}
                  </div>
                  {errorInfo && (
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                      {errorInfo}
                    </pre>
                  )}
                </div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Minimal error fallback for smaller components
 */
export const MinimalErrorFallback: React.FC<{
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
}> = ({ 
  error, 
  onRetry, 
  message = "Failed to load" 
}) => {
  return (
    <div className="flex items-center justify-center p-4 text-center">
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-gray-600">{message}</span>
        </div>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Loading error fallback for data fetching
 */
export const DataErrorFallback: React.FC<{
  error?: Error | null;
  onRetry?: () => void;
  resource?: string;
}> = ({ 
  error, 
  onRetry, 
  resource = "data" 
}) => {
  const isNetworkError = error?.message?.toLowerCase().includes('network') || 
                         error?.message?.toLowerCase().includes('fetch');

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <div>
        <h3 className="font-medium text-gray-900 mb-1">
          Failed to load {resource}
        </h3>
        <p className="text-sm text-gray-600">
          {isNetworkError 
            ? "Please check your internet connection and try again."
            : "There was a problem loading the data. Please try again."
          }
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};