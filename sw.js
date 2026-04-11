const CACHE_NAME = 'fann-ar-v1.2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // 1. Explicitly skip Firebase/Firestore APIs to prevent opaque response corruption
    if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('google.com')) return;

    // 2. Network-First for HTML navigation
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // 3. Cache-First with Support for Safari 206 Byte-Range & Cross-Origin CDNs
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).then((networkResponse) => {
                // Allow 200 (Standard), 206 (Safari Video), and type 'cors' (Tailwind/A-Frame CDNs)
                if (!networkResponse || 
                   (networkResponse.status !== 200 && networkResponse.status !== 206) || 
                   (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
                    return networkResponse;
                }
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});
