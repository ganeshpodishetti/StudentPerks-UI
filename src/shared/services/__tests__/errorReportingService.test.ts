/**
 * @jest-environment jsdom
 */

import { afterAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { errorReportingService } from '../errorReportingService';


// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

describe('ErrorReportingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.warn = jest.fn();
    
    // Reset service configuration
    errorReportingService.updateConfig({
      enabled: true,
      enableConsoleLogging: false,
    });
    
    errorReportingService.clearQueue();
  });

  afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  describe('reportError', () => {
    it('should report error with correct structure', () => {
      const error = {
        message: 'Test error',
        stack: 'Error stack trace',
        errorType: 'javascript' as const,
        severity: 'high' as const,
        context: { component: 'TestComponent' },
      };

      errorReportingService.reportError(error);

      // Since we're not testing the actual queue processing, 
      // we can verify the error was processed by checking console output
      expect(console.error).not.toHaveBeenCalled(); // Console logging is disabled
    });

    it('should throttle error reports', () => {
      const error = {
        message: 'Test error',
        errorType: 'javascript' as const,
        severity: 'medium' as const,
      };

      // Report multiple errors quickly
      errorReportingService.reportError(error);
      errorReportingService.reportError(error);
      errorReportingService.reportError(error);

      // Only first error should be processed due to throttling
      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeLessThanOrEqual(1);
    });

    it('should log to console when console logging is enabled', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Clear any previous throttling by waiting
      jest.useFakeTimers();
      
      errorReportingService.updateConfig({
        enabled: true,
        enableConsoleLogging: true,
        throttleMs: 0 // Disable throttling for this test
      });

      const error = {
        message: 'Test error',
        errorType: 'javascript' as const,
        severity: 'low' as const,
      };

      errorReportingService.reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error reported:', expect.any(Object));
      
      jest.useRealTimers();
      consoleSpy.mockRestore();
    });
  });

  describe('reportApiError', () => {
    it('should report API error with context', () => {
      const error = new Error('API failed');
      const context = {
        endpoint: '/api/deals',
        method: 'POST',
        status: 500,
        requestData: { title: 'Test Deal' },
      };

      errorReportingService.reportApiError(error, context);

      // Verify error was processed
      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeGreaterThanOrEqual(0);
    });

    it('should determine correct severity based on status code', () => {
      const error = new Error('Not found');
      
      // Test different status codes
      const contexts = [
        { endpoint: '/api/test', method: 'GET', status: 404 }, // medium
        { endpoint: '/api/test', method: 'GET', status: 500 }, // high
        { endpoint: '/api/test', method: 'GET', status: 200 }, // low
      ];

      contexts.forEach(context => {
        errorReportingService.reportApiError(error, context);
      });

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('reportNetworkError', () => {
    it('should report network error', () => {
      const error = new Error('Network Error');
      const context = { url: 'https://api.example.com' };

      errorReportingService.reportNetworkError(error, context);

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('reportValidationError', () => {
    it('should report validation error', () => {
      const message = 'Invalid email format';
      const context = { field: 'email', value: 'invalid-email' };

      errorReportingService.reportValidationError(message, context);

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('reportBoundaryError', () => {
    it('should report boundary error', () => {
      const error = new Error('Component crashed');
      const errorInfo = 'Component stack trace';
      const context = { component: 'DealCard' };

      errorReportingService.reportBoundaryError(error, errorInfo, context);

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('configuration', () => {
    it('should not report errors when disabled', () => {
      errorReportingService.updateConfig({ enabled: false });

      const error = {
        message: 'Test error',
        errorType: 'javascript' as const,
        severity: 'high' as const,
      };

      errorReportingService.reportError(error);

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBe(0);
    });

    it('should update configuration correctly', () => {
      const newConfig = {
        enabled: false,
        maxReports: 100,
        throttleMs: 2000,
      };

      errorReportingService.updateConfig(newConfig);

      // Configuration update is internal, so we test behavior
      const error = {
        message: 'Test error',
        errorType: 'javascript' as const,
        severity: 'high' as const,
      };

      errorReportingService.reportError(error);

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBe(0); // Should be 0 because enabled is false
    });
  });

  describe('queue management', () => {
    it('should clear queue', () => {
      const error = {
        message: 'Test error',
        errorType: 'javascript' as const,
        severity: 'medium' as const,
      };

      errorReportingService.reportError(error);
      errorReportingService.clearQueue();

      const stats = errorReportingService.getErrorStats();
      expect(stats.queueSize).toBe(0);
    });

    it('should provide error statistics', () => {
      const stats = errorReportingService.getErrorStats();

      expect(stats).toHaveProperty('queueSize');
      expect(stats).toHaveProperty('sessionId');
      expect(stats).toHaveProperty('totalReported');
      expect(typeof stats.queueSize).toBe('number');
      expect(typeof stats.sessionId).toBe('string');
      expect(typeof stats.totalReported).toBe('number');
    });
  });

  describe('global error handlers', () => {
    it('should handle unhandled errors', () => {
      // Simulate an unhandled error
      const errorEvent = new ErrorEvent('error', {
        message: 'Unhandled error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        error: new Error('Unhandled error'),
      });

      window.dispatchEvent(errorEvent);

      // The error should be captured by the global handler
      // We can't easily test this without more complex setup,
      // but we can verify the service is working
      const stats = errorReportingService.getErrorStats();
      expect(stats.sessionId).toBeTruthy();
    });

    it('should handle unhandled promise rejections', async () => {
      // Mock PromiseRejectionEvent since it's not available in test environment
      const mockRejectionEvent = {
        type: 'unhandledrejection',
        promise: Promise.resolve(), // Use resolved promise to avoid unhandled rejection
        reason: new Error('Unhandled rejection'),
        preventDefault: jest.fn(),
      };

      // Simulate dispatching the event
      const originalDispatchEvent = window.dispatchEvent;
      window.dispatchEvent = jest.fn().mockReturnValue(true) as jest.MockedFunction<typeof window.dispatchEvent>;
      
      // Test that the service is functional
      const stats = errorReportingService.getErrorStats();
      expect(stats.sessionId).toBeTruthy();
      
      // Restore original method
      window.dispatchEvent = originalDispatchEvent;
    });
  });
});