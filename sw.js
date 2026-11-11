const CACHE_NAME = 'deudaspagas-v1';
const assetsToCache = [
    './',
    './index.html'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
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
    self.clientClaim();
});

// Interceptación de solicitudes para funcionamiento offline
self.addEventListener('fetch', (event) => {
    // Permitir solicitudes a APIs externas (como la tasa online) sin bloquear si no hay internet
    if (event.request.url.includes('open.er-api.com')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).catch(() => {
                // Si falla la red y no está en caché, se puede manejar aquí si se desea
            });
        })
    );
});
