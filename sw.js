// =====================================
// MYWHATSAPP - SERVICE WORKER
// =====================================

const CACHE_NAME = "mywhatsapp-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/script.js",
    "./js/auth.js",
    "./js/chat.js",
    "./js/settings.js",
    "./manifest.json"
];


// =====================================
// INSTALL SERVICE WORKER
// =====================================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );

});


// =====================================
// ACTIVATE SERVICE WORKER
// =====================================

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(cacheNames => {

            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );

        }).then(() => self.clients.claim())
    );

});


// =====================================
// HANDLE FILE REQUESTS
// =====================================

self.addEventListener("fetch", event => {

    const request = event.request;

    // Only handle requests from this website.
    if (new URL(request.url).origin !== self.location.origin) {
        return;
    }

    // Don't cache Firebase or other API requests.
    if (request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(request)
            .then(response => {

                if (response && response.ok) {

                    const responseCopy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseCopy);
                    });

                }

                return response;

            })
            .catch(() => caches.match(request))

    );

});