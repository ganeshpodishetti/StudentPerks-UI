// Service Worker for PerksCrowd PWA
// Enables offline support, caching, and PWA features

const CACHE_VERSION = 'v2';
const CACHE_NAME = `perkscrowd-${CACHE_VERSION}`;

// Assets to cache on install (critical for offline)
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
];

// File patterns to cache on request (images, fonts, etc.)
const CACHEABLE_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|eot)$/,
  /^\/(icon-|apple-touch-|perkscrowd-)/,
];

// URL patterns to NOT cache (API calls, analytics, etc.)
const SKIP_CACHE_PATTERNS = [
  /^https?:\/\/api\./,
  /\?.*$/,
  /\/api\//,
  /^https?:\/\/ik\.imagekit\.io\//,
];

/**
 * Check if a URL should be cached
 */
function shouldCache(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Skip non-GET requests
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }

    // Skip cache-excluded patterns
    if (SKIP_CACHE_PATTERNS.some(pattern => pattern.test(pathname))) {
      return false;
    }

    // Cache critical assets and cacheable file patterns
    return (
      CRITICAL_ASSETS.includes(pathname) ||
      CACHEABLE_PATTERNS.some(pattern => pattern.test(pathname))
    );
  } catch {
    return false;
  }
}

/**
 * Install event - cache critical assets
 */
self.addEventListener('install', (event) => {
  const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      if (isDev) console.log('[SW] Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS).catch((error) => {
        if (isDev) console.log('[SW] Error caching critical assets:', error);
        // Continue even if some assets fail to cache
      });
    }).then(() => {
      if (isDev) console.log('[SW] Skipping waiting - activating immediately');
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            if (isDev) console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      if (isDev) console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - serve from cache, fall back to network
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Bypass Next.js internal and HMR requests to prevent infinite reloads in development
  if (
    url.includes('/_next/') || 
    url.includes('/__nextjs') || 
    url.includes('webpack-hmr') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1')
  ) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip data URLs
  if (url.startsWith('data:')) {
    return;
  }

  // Network-first strategy for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const cache_copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cache_copy);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache for navigation
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return offline page if available
            return caches.match('/offline.html').catch(() => {
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
          });
        })
    );
    return;
  }

  // Cache-first strategy for cacheable assets
  if (shouldCache(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const cache_copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cache_copy);
            });
          }
          return response;
        }).catch((error) => {
          // Return a placeholder for failed resources
          if (request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif" font-size="16">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          throw error;
        });
      })
    );
    return;
  }

  // Network-only for other requests (API calls, etc.)
  event.respondWith(
    fetch(request).catch(() => {
      // Return offline response for failed requests
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
  const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

  if (event.data && event.data.type === 'SKIP_WAITING') {
    if (isDev) console.log('[SW] Skipping waiting...');
    self.skipWaiting();
  }
});

