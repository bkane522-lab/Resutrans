const CACHE = "resutrans-v4";
const SHELL = ["./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-192-maskable.png", "./icon-512-maskable.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// Only cache the app shell. Never intercept calls to api.groq.com.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin.includes("groq.com")) return;

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
