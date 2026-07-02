const CACHE = "viviendo-juntos-v2";
const STATIC_CACHE = "viviendo-juntos-static-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(["/manifest.json", "/icon.svg"]);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== STATIC_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ).then(() => clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo intercepta peticiones de nuestro origen
  if (url.origin !== self.location.origin) return;

  // Assets estáticos: cache-first (js, css, imágenes, fuentes)
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navegación (páginas HTML): network-first, fallback a cache
  if (request.destination === "document" || request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // API calls y otros: red solamente
  return;
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Sin conexión", { status: 503 });
  }
}
