const CACHE_NAME = 'budgetwise-v1';
const RUNTIME_CACHE = 'budgetwise-runtime-v1';

// Ressources à mettre en cache au moment de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  self.clients.claim();
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorer les requêtes vers l'API (toujours essayer le réseau)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cloner la réponse car elle ne peut être utilisée qu'une seule fois
          const responseClone = response.clone();
          
          // Sauvegarder dans le cache pour usage hors ligne
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // En cas d'échec réseau, essayer de récupérer depuis le cache
          return caches.match(request);
        })
    );
    return;
  }

  // Pour les autres ressources : Cache First avec fallback réseau
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Ressource trouvée dans le cache
        // Mettre à jour le cache en arrière-plan
        fetch(request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response);
          });
        });
        
        return cachedResponse;
      }

      // Ressource non trouvée dans le cache, récupérer depuis le réseau
      return fetch(request).then((response) => {
        // Sauvegarder dans le cache pour la prochaine fois
        const responseClone = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        
        return response;
      });
    })
  );
});

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

// Synchroniser les transactions en attente
async function syncTransactions() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const requests = await cache.keys();
    
    // Filtrer les requêtes POST/PUT/DELETE en attente
    const pendingRequests = requests.filter((request) => {
      return request.method !== 'GET';
    });
    
    // Renvoyer les requêtes
    for (const request of pendingRequests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.error('[Service Worker] Sync failed for request:', request.url, error);
      }
    }
    
    console.log('[Service Worker] Sync completed');
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
  }
}

// Notifications push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BudgetWise';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Chercher si une fenêtre est déjà ouverte
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
