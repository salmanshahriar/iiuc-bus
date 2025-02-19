const CACHE_NAME = "iiuc-bus-tracker-v1"
const OFFLINE_URL = "/offline"

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      self.skipWaiting()
    ])
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ])
  )
})

self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      
      // Try cache first
      const cachedResponse = await cache.match(event.request)
      if (cachedResponse) {
        // Return cached response and update cache in background
        fetch(event.request)
          .then(response => {
            if (response.ok) {
              cache.put(event.request, response.clone())
            }
          })
          .catch(() => {/* ignore */})
        
        return cachedResponse
      }

      // If not in cache, try network
      try {
        const networkResponse = await fetch(event.request)
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone())
        }
        return networkResponse
      } catch (error) {
        // Network failed, show offline page for navigation requests
        if (event.request.mode === 'navigate') {
          const offlineResponse = await cache.match(OFFLINE_URL)
          if (offlineResponse) {
            return offlineResponse
          }
        }
        
        return new Response('Network error', {
          status: 408,
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        })
      }
    })()
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})