const CACHE_NAME = 'mon-itineraire-cache-v6'; // Incrémenter la version pour forcer la mise à jour
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

// Intercepter les requêtes réseau
self.addEventListener('fetch', event => {
  const { request } = event;

  // Stratégie "Network falling back to cache"
  // On essaie d'abord le réseau pour avoir les données les plus fraîches.
  // Si le réseau échoue (hors ligne), on se rabat sur le cache.
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // Si la requête réussit, on met la nouvelle version en cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si le réseau échoue, on cherche dans le cache
        return caches.match(request);
      })
  );
});