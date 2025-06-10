const cacheVersion = '__CACHE_VERSION__'; // 这将被构建脚本替换
const cacheName = `blog-cache-${cacheVersion}`;

// 缓存策略类型
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// 初始缓存文件
const initialCacheFiles = [
  // 核心页面
  "/",
  "/index.html",
  "/archives/index.html",
  "/categories/index.html", 
  "/tags/index.html",
  "/404.html",
  
  // 关键样式文件
  "/css/main.css",
  "/css/highlight.css",
  
  // 核心脚本
  "/js/boot.js",
  "/js/utils.js",
  "/js/events.js",
  "/js/plugins.js",
  "/js/color-schema.js",
  
  // 重要图片
  "/img/icons/icon192.png", // PWA 图标
  "/img/icons/icon512.png", // PWA 大图标
  
  // PWA 必备文件
  "/manifest.json",
  
  // 搜索功能相关
  "/xml/local-search.xml",
  "/js/local-search.js"
];

// 最大缓存项数量
const MAX_CACHE_ITEMS = 500;
// 触发清理的阈值
const CACHE_CLEANUP_THRESHOLD = 450;
// 一次清理的比例
const CACHE_CLEANUP_PERCENT = 0.1;

/**
 * 安装 Service Worker
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(initialCacheFiles);
    })
  );
  self.skipWaiting();
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
    }).then(() => {
      self.clients.claim();
    })
  );
});

/**
 * 检查请求是否可缓存
 * 阻止不支持的URL方案（如chrome-extension:）
 */
function isCacheableRequest(request) {
  try {
    const url = new URL(request.url);
    // 只有 GET 请求且使用 http/https 协议的请求才可缓存
    return ['http:', 'https:'].includes(url.protocol) && request.method === 'GET';
  } catch (e) {
    return false;
  }
}

/**
 * 决定使用哪种缓存策略
 */
function decideCachingStrategy(url, request) {
  // 首先检查URL协议和请求方法
  if (!['http:', 'https:'].includes(url.protocol) || request.method !== 'GET') {
    return null; // 不缓存非http/https协议的资源或非GET请求
  }
  
  const path = url.pathname;
  
  // 忽略特定路径
  if (path.startsWith('/admin/') || path.startsWith('/.netlify/')) {
    return null;
  }
  
  // 图片文件使用缓存优先策略
  if (path.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|bmp)$/i)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // HTML 文件使用网络优先策略
  if (path.endsWith('/') || path.endsWith('.html')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // JS/CSS 等静态资源使用缓存优先策略
  if (path.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }

  // API 请求或其他动态内容使用 stale-while-revalidate 策略
  if (path.includes('/api/') || request.headers.get('Accept')?.includes('application/json')) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // 默认使用缓存优先策略
  return CACHE_STRATEGIES.CACHE_FIRST;
}

/**
 * 安全地缓存响应
 */
async function safeCachePut(cache, request, response) {
  // 只缓存 GET 请求的成功响应
  if (request.method === 'GET' && response && response.ok && response.status < 400) {
    try {
      await cache.put(request, response);
    } catch (error) {
      console.log('缓存写入失败:', error.message);
    }
  }
}

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
  // 检查请求是否可缓存
  if (!isCacheableRequest(request)) {
    // 对于不可缓存的请求，直接通过网络获取
    try {
      return await fetch(request);
    } catch (error) {
      console.log('不可缓存的请求获取失败:', error);
      return new Response('资源不可用', {
        status: 408,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
  }
  
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(cacheName);
      await safeCachePut(cache, request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    return new Response('网络请求失败，请检查您的连接', {
      status: 408,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  }
}

/**
 * 网络优先策略
 */
async function networkFirst(request) {
  // 检查请求是否可缓存
  if (!isCacheableRequest(request)) {
    try {
      return await fetch(request);
    } catch (error) {
      return new Response('资源不可用', {
        status: 408,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(cacheName);
      await safeCachePut(cache, request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('网络请求失败且缓存中没有此资源', {
      status: 504,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  }
}

/**
 * Stale While Revalidate 策略
 */
async function staleWhileRevalidate(request) {
  // 检查请求是否可缓存
  if (!isCacheableRequest(request)) {
    try {
      return await fetch(request);
    } catch (error) {
      return new Response('资源不可用', {
        status: 408,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
  }
  
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.ok) {
        safeCachePut(cache, request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(error => {
      console.log('获取资源失败:', error);
      return null;
    });
  
  return cachedResponse || fetchPromise;
}

/**
 * 清理过旧的缓存项目
 */
async function trimCache() {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    if (requests.length > CACHE_CLEANUP_THRESHOLD) {
      console.log(`缓存项数量(${requests.length})超过阈值(${CACHE_CLEANUP_THRESHOLD})，开始清理`);
      
      const deleteCount = Math.floor(requests.length * CACHE_CLEANUP_PERCENT);
      
      for (let i = 0; i < deleteCount; i++) {
        await cache.delete(requests[i]);
      }
      
      console.log(`已清理${deleteCount}个缓存项，当前缓存数量: ${requests.length - deleteCount}`);
    }
  } catch (error) {
    console.error('缓存清理过程中出错:', error);
  }
}

/**
 * 处理请求并应用相应的缓存策略
 */
self.addEventListener("fetch", event => {
  // 定期清理缓存
  if (Math.random() < 0.05) {
    event.waitUntil(trimCache());
  }
  
  // 检查请求是否使用支持的协议
  const url = new URL(event.request.url);
  if (!['http:', 'https:'].includes(url.protocol)) {
    return; // 不处理非http/https协议的请求
  }
  
  // 确定缓存策略
  const strategy = decideCachingStrategy(url, event.request);
  
  // 如果是不需要缓存的请求，直接跳过
  if (!strategy) return;
  
  // 应用相应策略
  switch (strategy) {
    case CACHE_STRATEGIES.NETWORK_FIRST:
      event.respondWith(networkFirst(event.request));
      break;
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      event.respondWith(staleWhileRevalidate(event.request));
      break;
    case CACHE_STRATEGIES.CACHE_FIRST:
    default:
      event.respondWith(cacheFirst(event.request));
      break;
  }
});

/**
 * 可选: 监听消息事件，支持手动控制缓存
 */
self.addEventListener('message', event => {
  if (event.data && event.data.action) {
    switch (event.data.action) {
      case 'skipWaiting':
        self.skipWaiting();
        break;
      case 'clearCache':
        event.waitUntil(
          caches.delete(cacheName).then(() => {
            return caches.open(cacheName);
          }).then(cache => {
            return cache.addAll(initialCacheFiles);
          })
        );
        break;
    }
  }
});