const CACHE_NAME = 'mon-itineraire-cache-v2';
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './services/geminiService.ts',
  './components/ItineraryForm.tsx',
  './components/ItineraryDisplay.tsx',
  './components/SavedItineraries.tsx',
  './components/icons/ArrowDownIcon.tsx',
  './components/icons/ArrowUpIcon.tsx',
  './components/icons/BusIcon.tsx',
  './components/icons/CarIcon.tsx',
  './components/icons/LocationIcon.tsx',
  './components/icons/PlusIcon.tsx',
  './components/icons/SpinnerIcon.tsx',
  './components/icons/TrashIcon.tsx',
  './components/icons/ViewIcon.tsx',
  './components/icons/WalkIcon.tsx'
];

// On install, cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                   .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// On fetch, use a cache-first strategy
self.addEventListener('fetch', event => {
  const { request } = event;

  // Always bypass for non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Always fetch API requests from the network
  if (request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(fetch(request));
    return;
  }
  
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from network, cache it, and return it
      return fetch(request).then(networkResponse => {
        // Check for a valid response to cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(error => {
        console.error('Fetching failed:', error);
        // You could return a custom offline page here if you had one
        throw error;
      });
    })
  );
});