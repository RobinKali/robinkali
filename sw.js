const CACHE_NAME = 'robinkali-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/style.css',
    '/assets/pages.css',
    '/assets/snake-game.css',
    '/assets/script.js',
    '/assets/snake-game.js',
    '/pages/bikes.html',
    '/pages/av.html',
    '/pages/web.html',
    '/pages/sim.html',
    '/site.webmanifest',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event - Cache Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serve Cache, Fallback to Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit - Return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
