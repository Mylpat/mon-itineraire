// Importer Babel pour la transpilation
importScripts('https://unpkg.com/@babel/standalone/babel.min.js');

const CACHE_NAME = 'mon-itineraire-cache-v5'; // Incrémenter la version pour forcer la mise à jour
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
    }).then(() => self.clients.claim())
  );
});

/**
 * Fonction robuste pour transpiler le code et gérer les erreurs.
 * @param {Request} request - La requête originale.
 * @returns {Promise<Response>} Une promesse qui se résout avec la réponse transpilée ou une réponse d'erreur.
 */
async function transpileAndCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (!networkResponse.ok) {
      throw new Error(`Erreur réseau: ${networkResponse.status} ${networkResponse.statusText}`);
    }
    
    const code = await networkResponse.text();

    // Heuristique simple pour détecter si on a reçu du HTML au lieu de JS/TS
    if (code.trim().startsWith('<')) {
        throw new Error("Le fichier reçu semble être du HTML, et non du code source. L'URL est peut-être incorrecte.");
    }
    
    // Transpilation
    const transpiled = Babel.transform(code, {
      presets: ['env', 'react', 'typescript'],
      filename: new URL(request.url).pathname
    }).code;
    
    const responseToCache = new Response(transpiled, {
      headers: { 'Content-Type': 'application/javascript' }
    });
    
    // Mettre en cache la version transpilée
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, responseToCache.clone());
    
    return responseToCache;

  } catch (error) {
    console.error(`[SW] Erreur pour ${request.url}:`, error);
    // Renvoyer une réponse JS valide qui affiche l'erreur dans la console du client
    // Cela évite le plantage du chargement du module.
    return new Response(`console.error("[SW] Impossible de charger le module '${request.url}'. Erreur: ${error.message.replace(/"/g, "'")}");`, {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
}

// Intercepter toutes les requêtes réseau
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Gérer uniquement les fichiers .ts/.tsx de notre origine
  if (request.method === 'GET' && url.origin === self.location.origin && (url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts'))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          // Si une version transpilée est en cache, on la sert.
          if (cachedResponse) {
            return cachedResponse;
          }
          // Sinon, on lance le processus de transpilation.
          return transpileAndCache(request);
        });
      })
    );
  } else {
    // Pour tous les autres fichiers (HTML, SVG, CDN, etc.), utiliser une stratégie de cache-first
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request);
      })
    );
  }
});
