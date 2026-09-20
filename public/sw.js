
const CACHE_NAME = "antara-v2"; 
const OFFLINE_AUDIO_CACHE = "antara-offline-audio"; 
const APP_SHELL = ["/", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== OFFLINE_AUDIO_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  
  if (requestUrl.origin.includes('supabase.co') && requestUrl.pathname.includes('/storage/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

 
  if (
    requestUrl.pathname.startsWith("/_next/") || 
    requestUrl.pathname.startsWith("/api/") ||
    requestUrl.pathname.includes('manifest')
  ) {
    return; 
  }

  
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        const copy = networkResponse.clone();

        if (requestUrl.pathname.startsWith("/audio/")) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }

        return networkResponse;
      }).catch(() => {});
    })
  );
});