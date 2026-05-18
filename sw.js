const CACHE = 'tml-parking-v1';
const ASSETS = [
  '/parking-tml/',
  '/parking-tml/index.html',
  '/parking-tml/dashboard.html',
  '/parking-tml/manifest.json',
  '/parking-tml/icon-192.png',
  '/parking-tml/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ne pas cacher les appels Google Sheets (données dynamiques)
  if (e.request.url.includes('google.com') || e.request.url.includes('script.google')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
