// Service Worker for Peluquería Petit
// Provides offline functionality and caching

const CACHE_NAME = 'peluqueria-petit-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/CSS/stylesmarron.css',
  '/CSS/critical.css',
  '/js/main.js',
  '/manifest.json',
  '/images/copiapecacorta-enhanced-enhanced (1)_11zon.jpg',
  '/images/jubilado-enhanced_11zon (1).jpg',
  '/images/desv-enhanced_upscayl_3x_realesrgan-x4plus.webp',
  '/images/female-client-getting-her-hair-cut-hairdresser_11zon (1).jpg',
  '/images/50362022_11zon.jpg',
  '/images/Diseño sin título (2) (1).jpg',
  '/images/beautiful-keratin-treated-hair.jpg',
  '/images/agustincopia_11zon.jpg',
  '/images/45656cca-ac91-4d53-a5d1-ab78b26639e4-enhanced_upscayl_5x_realesrgan-x4plus_11zon.jpg',
  '/images/rizos_11zon.webp',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle offline WhatsApp messages or form submissions
  return new Promise((resolve) => {
    // Placeholder for future offline functionality
    console.log('Background sync completed');
    resolve();
  });
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Peluquería Petit',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Peluquería Petit', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('https://wa.me/543884461948')
  );
});
