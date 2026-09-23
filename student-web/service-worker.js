// Learn Me Service Worker - Offline Caching & Mobile Support
const CACHE_NAME = 'learnme-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/quize.html',
    '/verify.html',
    '/css/style.css',
    '/js/script.js',
    '/assets/learnme-logo.png',
    '/manifest.json'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('Pre-caching partial failure, fallback will continue:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Network First with Cache Fallback for dynamic app data
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Skip non-GET and API calls (API handled live)
    if (event.request.method !== 'GET' || requestUrl.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
