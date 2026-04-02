'use client';

import { browserConsole, suppressProductionLogsAndErrors } from '@/shared/utils/runtimeSafety';
import { useEffect } from 'react';

/**
 * Register service worker for PWA functionality
 */
function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    browserConsole.log('[SW] Service Workers not supported in this browser');
    return;
  }

  // In development, unregister any active service workers to prevent Turbopack/HMR caching issues and infinite loops
  if (process.env.NODE_ENV !== 'production') {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        browserConsole.log('[SW] Unregistered Service Worker in development');
      }
    });
    return;
  }

  // Register the service worker
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none',
  }).then((registration) => {
    browserConsole.log('[SW] Service Worker registered successfully:', registration);

    // Check for updates regularly
    const checkForUpdates = () => {
      registration.update().then(() => {
        if (registration.waiting) {
          browserConsole.log('[SW] Service Worker update available');
        }
      });
    };

    // Check for updates every hour
    setInterval(checkForUpdates, 60 * 60 * 1000);
  }).catch((error) => {
    browserConsole.error('[SW] Service Worker registration failed:', error);
  });

  // Listen for controller change (new SW took over)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    browserConsole.log('[SW] Controller changed - new Service Worker is now active');
  });
}

/**
 * Initializes client-side error suppression for production environment.
 * Suppresses console logs but NOT error events (error reporting must remain active).
 */
export function RootClientInitializer() {
  useEffect(() => {
    registerServiceWorker();
    suppressProductionLogsAndErrors();
  }, []);

  return null;
}
