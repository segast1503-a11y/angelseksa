// Service worker: кладёт приложение и шрифты в память телефона, чтобы всё открывалось без интернета.
const CACHE = "raspisanie-v1";
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Unbounded:wght@500;600&display=swap";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL);
    // Шрифты: сохраняем при первом запуске с интернетом. Если не вышло, приложение работает на системных шрифтах.
    try {
      const res = await fetch(FONT_CSS, { mode: "cors" });
      if (res.ok) {
        const css = await res.clone().text();
        await cache.put(FONT_CSS, res);
        const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
        await Promise.all(urls.map((u) => cache.add(new Request(u, { mode: "cors" })).catch(() => {})));
      }
    } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) {
      // Отдаём из памяти сразу, а свежую версию подтягиваем в фоне. Обновление видно при следующем запуске.
      if (url.origin === location.origin) {
        fetch(req).then((r) => { if (r && r.ok) cache.put(req, r.clone()); }).catch(() => {});
      }
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    } catch (_) {
      if (req.mode === "navigate") {
        const index = (await cache.match("index.html")) || (await cache.match("./"));
        if (index) return index;
      }
      return Response.error();
    }
  })());
});
