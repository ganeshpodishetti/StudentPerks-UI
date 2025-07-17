import { useToast } from '@/shared/components/ui/use-toast';
import { errorReportingService } from '../services/errorReportingService';
import { createContext, ReactNode, useCallback, useContext } from 'react';

interface ErrorContextType {
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  handleApiError: (error: any, context?: { endpoint?: string; method?: string }) => void;
  handleNetworkError: (error: any, context?: Record<string, any>) => void;
  handleValidationError: (message: string, context?: Record<string, any>) => void;
  handleBoundaryError: (error: Error, errorInfo: string, context?: Record<string, any>) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const showError = useCallback((message: string, title: string = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  const showSuccess = useCallback((message: string, title: string = "Success") => {
    toast({
      title,
      description: message,
    });
  }, [toast]);

  const showWarning = useCallback((message: string, title: string = "Warning") => {
    toast({
      title,
      description: message,
      variant: "destructive", // Adjust if you have a warning variant
    });
  }, [toast]);

  const showInfo = useCallback((message: string, title: string = "Info") => {
    toast({
      title,
      description: message,
      variant: "default",
    });
  }, [toast]);

  const handleApiError = useCallback((error: any, context?: { endpoint?: string; method?: string }) => {
    console.error('API Error:', error);
    
    // Report to error service
    if (context?.endpoint && context?.method) {
      errorReportingService.reportApiError(error, {
        endpoint: context.endpoint,
        method: context.method,
        status: error?.response?.status,
        requestData: error?.config?.data,
      });
    } else {
      errorReportingService.reportError({
        message: error?.message || 'API Error',
        stack: error?.stack,
        errorType: 'api',
        severity: 'medium',
        context: { error },
      });
    }
    
    // Handle different error types with appropriate messages
    if (error.response?.status === 401) {
      showError("Please log in again to continue", "Authentication Error");
    } else if (error.response?.status === 403) {
      showError("You don't have permission to perform this action", "Access Denied");
    } else if (error.response?.status === 404) {
      showError("The requested resource was not found", "Not Found");
    } else if (error.response?.status >= 500) {
      showError("Server error occurred. Please try again later", "Server Error");
    } else if (error.response?.data?.message) {
      showError(error.response.data.message);
    } else if (error.message) {
      showError(error.message);
    } else {
      showError("An unexpected error occurred");
    }
  }, [showError]);

  const handleNetworkError = useCallback((error: any, context?: Record<string, any>) => {
    console.error('Network Error:', error);
    
    errorReportingService.reportNetworkError(error, context);
    
    showError('Please check your internet connection and try again', 'Connection Error');
  }, [showError]);

  const handleValidationError = useCallback((message: string, context?: Record<string, any>) => {
    console.warn('Validation Error:', message);
    
    errorReportingService.reportValidationError(message, context);
    
    showError(message, 'Validation Error');
  }, [showError]);

  const handleBoundaryError = useCallback((error: Error, errorInfo: string, context?: Record<string, any>) => {
    console.error('Boundary Error:', error, errorInfo);
    
    errorReportingService.reportBoundaryError(error, errorInfo, context);
    
    showError('An unexpected error occurred. The page will be refreshed.', 'Application Error');
  }, [showError]);

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

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};
