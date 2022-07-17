import { version } from "../package.json";

const appName = 'sandbox'
const cacheName = `${appName}-v${version}`

const appShellFiles = [
  `/index.html`,
  `/manifest.json`,
  `/bundle.js`,
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install')

  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      await cache.addAll(appShellFiles);
    })(),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));

  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      await cache.addAll(appShellFiles);
    })(),
  )
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request)
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
      if (r) {
        return r
      }
      const response = await fetch(e.request)
      const cache = await caches.open(cacheName)
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
      cache.put(e.request, response.clone())
      return response
    })(),
  )
})
