// Importer Babel pour la transpilation
importScripts('https://unpkg.com/@babel/standalone/babel.min.js');

const CACHE_NAME = 'mon-itineraire-cache-v3'; // Incrémenter la version pour forcer la mise à jour
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// À l'installation, mettre en cache les fichiers de base de l'application (l'App Shell)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL_URLS))
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
    }).then(() => self.clients.claim()) // Prendre le contrôle de la page immédiatement
  );
});

/**
 * Fonction principale pour intercepter, transpiler, mettre en cache et servir les fichiers TSX/TS.
 * @param {FetchEvent} event - L'événement fetch intercepté.
 * @returns {Promise<Response>} Une promesse qui se résout avec la réponse (transpilée ou non).
 */
async function transpileAndCache(event) {
  const { request } = event;
  const url = new URL(request.url);

  // D'abord, vérifier si une version déjà transpilée est dans le cache
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Si non, récupérer le fichier source (.tsx ou .ts)
  const networkResponse = await fetch(request);
  const code = await networkResponse.text();

  // Le transpiler avec Babel
  const transpiled = Babel.transform(code, {
    presets: ['react', 'typescript'],
    filename: url.pathname // Important pour que Babel sache comment parser le fichier
  }).code;

  // Créer une nouvelle réponse avec le code transpilé et le bon type de contenu
  const responseToCache = new Response(transpiled, {
    headers: { 'Content-Type': 'application/javascript' }
  });

  // Mettre cette nouvelle réponse transpilée en cache pour les prochaines fois
  await cache.put(request, responseToCache.clone());

  // Retourner la réponse transpilée
  return responseToCache;
}

// Intercepter toutes les requêtes réseau
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Si la requête est pour un fichier .tsx ou .ts de notre application
  if (request.method === 'GET' && url.origin === self.location.origin && (url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts'))) {
    // Utiliser notre logique de transpilation
    event.respondWith(transpileAndCache(event));
  } else {
    // Pour tous les autres fichiers (HTML, SVG, CDN, etc.), utiliser une stratégie de cache simple
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        // Si le fichier est en cache, le servir
        // Sinon, le récupérer sur le réseau
        return cachedResponse || fetch(request);
      })
    );
  }
});