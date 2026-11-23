const CACHE_NAME = 'princesa-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/corazon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// 🔔 Notificación push bonita
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '💖 Mi princesa, hay algo nuevo para ti';
  const options = {
    body: data.body || 'Entra a ver la sorpresa que te dejé 🥰',
    icon: data.icon || './icons/corazon-192.png',
    badge: './icons/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'sorpresa-amor',
    renotify: true,
    actions: [
      { action: 'ver', title: 'Ver sorpresa 💝' },
      { action: 'luego', title: 'Luego' }
    ],
    data: { url: data.url || './index.html' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'luego') return;

  const url = event.notification.data.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});