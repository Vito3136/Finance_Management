const CACHE_NAME = 'finance-app-v53';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/translations.js',
  './js/demo_data.js',
  './js/faceid.js',
  './manifest.json',
  './icon.png'
];

// Install event (Skip waiting immediately)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
  );
});

// Activate event (Clean up old caches immediately and claim clients)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event (Network First, fallback to cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Se la rete funziona, aggiorniamo la cache con la nuova versione
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Se non c'è rete (offline), usiamo la cache
        return caches.match(event.request);
      })
  );
});
