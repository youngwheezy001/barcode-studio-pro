// Barcode Studio Pro — Smart Cache-First Service Worker v3.0
// Cache static assets on first load; serve from cache on repeat visits.
// This eliminates Render.com cold-start delays and makes the app load instantly on return visits.

const CACHE_NAME = 'bsp-static-v5';

// Assets to cache on install (critical path — these make the app feel instant)
const PRECACHE_URLS = [
  '/favicon.svg',
  '/favicon-32x32.png',
  '/manifest.json',
];

// Cache-first strategy: CDN libraries, card templates, images
const CACHE_FIRST_PATTERNS = [
  /cdn\.jsdelivr\.net/,
  /cdnjs\.cloudflare\.com/,
  /cdn\.tailwindcss\.com/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /\/card_templates\/.*\.(webp|png|jpg|svg)$/,
  /\/static\/.*\.(webp|png|jpg|svg|ico)$/,
];

// Network-first strategy: State Engine, API calls and dynamic routes must ALWAYS be fresh
const NETWORK_FIRST_PATTERNS = [
  /\/static\/state_engine\.js/,
  /state_engine\.js/,
  /\/api\//,
  /\/auth\//,
  /\/admin\//,
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Always bypass for non-GET or API/auth routes (network-first)
  if (event.request.method !== 'GET') return;
  if (NETWORK_FIRST_PATTERNS.some((p) => p.test(url))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for static assets and CDN libraries
  if (CACHE_FIRST_PATTERNS.some((p) => p.test(url))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // For everything else (HTML pages): network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
