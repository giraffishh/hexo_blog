const cacheName = "blog-cache-v1";

// 初始缓存的关键静态文件
const initialCacheFiles = [
  "/",
  "/index.html",
  "/manifest.json"
];

/**
 * 安装 Service Worker
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(initialCacheFiles).catch(error => {
        console.error(`Failed to cache initial files:`, error);
      });
    })
  );
  self.skipWaiting(); // 立即接管控制
});

/**
 * 激活 Service Worker
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
    })
  );
  self.clients.claim(); // 激活后立即接管控制
});

/**
 * 拦截网络请求并动态缓存
 */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(cacheName).then(cache => {
            cache.put(event.request, responseToCache).catch(error => {
              console.error(`Failed to cache ${event.request.url}:`, error);
            });
          });
        }
        return networkResponse;
      });

      // 返回缓存的响应（如果有），同时进行网络请求更新缓存
      return cachedResponse || fetchPromise;
    })
  );
});