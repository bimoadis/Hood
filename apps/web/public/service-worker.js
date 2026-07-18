const CACHE_NAME = 'hoodlings-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/gallery',
  '/manifest.json',
  '/uploads/robin_fox.png',
  '/uploads/hartley.png',
  '/uploads/little_john.png',
  '/uploads/harelock.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static app assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Active');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
