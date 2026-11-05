// Barcode Studio Pro - Service Worker Killswitch
// Instantly unregisters and clears all browser caches to eliminate any blank screen issues.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Notice: NO fetch event listener.
// Zero interception of network requests so Chrome always loads pages directly.
