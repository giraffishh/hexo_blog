const cacheVersion = '__CACHE_VERSION__'; // This will be replaced by the build script
const cacheName = `blog-cache-${cacheVersion}`;

// Initial cache files
const initialCacheFiles = [
  "/",
  "/index.html",
  "/manifest.json"
];

/**
 * Install Service Worker
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(initialCacheFiles);
    })
  );
  self.skipWaiting(); // Immediately take control
});

/**
 * Activate Service Worker
 */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      self.clients.claim(); // Immediately take control
    })
  );
});

/**
 * Fetch request and cache first strategy
 */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(cacheName).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});