const CACHE_NAME = 'mon-itineraire-cache-v7'; // Incrémenter la version pour forcer la mise à jour
const APP_FILES = [
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
  './components/icons/CarIcon.tsx',
  './components/icons/WalkIcon.tsx',
  './components/icons/BusIcon.tsx',
  './components/icons/LocationIcon.tsx',
  './components/icons/PlusIcon.tsx',
  './components/icons/TrashIcon.tsx',
  './components/icons/ArrowUpIcon.tsx',
  './components/icons/ArrowDownIcon.tsx',
  './components/icons/SpinnerIcon.tsx',
  './components/icons/ViewIcon.tsx'
];

// À l'installation, mettre en cache les fichiers de l'application
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// À l'activation, nettoyer les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('mon-itineraire-cache-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepter les requêtes réseau avec la stratégie "Stale-While-Revalidate"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Si la requête réseau réussit, on met à jour le cache
          if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // Retourner la réponse du cache si elle existe (pour un chargement rapide/hors-ligne),
        // sinon attendre la réponse du réseau. La prochaine fois, ce sera en cache.
        return response || fetchPromise;
      });
    })
  );
});
