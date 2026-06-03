const CACHE_VERSION = 'v2';
const PRECACHE = `ampler-precache-${CACHE_VERSION}`;
const RUNTIME_IMAGE_CACHE = 'ampler-runtime-images';
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './css/screensize.css',
  './js/index.js',
  './.github/assets/logo.png',
  './assets/icons/icon-72x72.png',
  './assets/icons/icon-96x96.png',
  './assets/icons/icon-128x128.png',
  './assets/icons/icon-144x144.png',
  './assets/icons/icon-152x152.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-384x384.png',
  './assets/icons/icon-512x512.png'
];

// limit items in a cache (simple FIFO eviction)
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
  // allow the new worker to become active immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== PRECACHE && key !== RUNTIME_IMAGE_CACHE) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();

  // notify clients that the new service worker is active
  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
    clients.forEach(client => client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION }));
  });
});

self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Navigation requests (SPA pages) — network-first with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(response => {
        // Optionally update the cache for navigations
        const copy = response.clone();
        caches.open(PRECACHE).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./offline.html'))
    );
    return;
  }

  // Static resources — cache-first
  if (url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/') || url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
        if (res && res.type !== 'opaque') {
          caches.open(PRECACHE).then(cache => cache.put(event.request, res.clone()));
        }
        return res;
      }))
    );
    return;
  }

  // Images — cache-first with a runtime-image cache and simple size limit
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
    event.respondWith(
      caches.open(RUNTIME_IMAGE_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
            limitCacheSize(RUNTIME_IMAGE_CACHE, 60);
          }
          return response;
        } catch (err) {
          // fallback to a bundled icon
          return caches.match('./assets/icons/icon-192x192.png');
        }
      })
    );
    return;
  }

  // Default — try cache, then network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
