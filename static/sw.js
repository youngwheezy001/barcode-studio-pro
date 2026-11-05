// Barcode Studio Pro - Progressive Web App Service Worker (v2 - Fail-safe)
const CACHE_NAME = 'barcode-studio-cache-v2';

const STATIC_PRECACHE = [
  '/',
  '/favicon.svg',
  '/favicon.ico',
  '/manifest.json'
];

// Install: Cache core local assets defensively without blocking installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_PRECACHE.map((url) => 
          cache.add(url).catch((err) => {
            console.warn('[SW v2] Pre-cache skipped for:', url, err);
          })
        )
      );
    })
  );
});

// Activate: Immediately purge all legacy caches (including v1) and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW v2] Purged legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Fail-safe pass-through to ensure the browser NEVER encounters a blank screen
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1. Pass through all navigation requests directly to browser network stack.
  // This guarantees Chrome NEVER receives undefined on page load / reload.
  if (req.mode === 'navigate') {
    return;
  }

  // 2. Pass through non-GET, API calls, auth routes, and external CDNs
  if (
    req.method !== 'GET' ||
    !req.url.startsWith(self.location.origin) ||
    req.url.includes('/api/') ||
    req.url.includes('/users/') ||
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/create-checkout-session')
  ) {
    return;
  }

  // 3. For local static assets (favicons, icons, manifest), use cache-first with safe network fallback
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Safe fallback - never resolve with undefined
        return cachedResponse || new Response('', { status: 408, statusText: 'Request Timed Out' });
      });
    })
  );
});
