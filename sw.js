const CACHE = "resutrans-v2";
const SHELL = ["./index.html", "./manifest.json", "./icon.svg"];

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
