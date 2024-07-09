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
      return Promise.all(
        initialCacheFiles.map(file => {
          return cache.add(file).catch(error => {
            console.error(`Failed to cache ${file}:`, error);
          });
        })
      );
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
  console.log(`Fetching: ${event.request.url}`); // 调试信息
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(`Found in cache: ${event.request.url}`);
        return response;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          console.log(`Network request failed for: ${event.request.url}`);
          return networkResponse;
        }

        let responseToCache = networkResponse.clone();
        caches.open(cacheName).then(cache => {
          cache.put(event.request, responseToCache).catch(error => {
            console.error(`Failed to cache ${event.request.url}:`, error);
          });
        });

        return networkResponse;
      }).catch(error => {
        console.error(`Fetching failed for ${event.request.url}:`, error);
        throw error;
      });
    })
  );
});