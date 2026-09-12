importScripts("scram/scramjet.all.js");
importScripts("glass/glassJS.bundle.js");
importScripts("glass/glassJS.config.js");
importScripts("glass/glassJS.sw.js");

if (navigator.userAgent.includes("Firefox")) {
  Object.defineProperty(globalThis, "crossOriginIsolated", {
    value: true,
    writable: true,
  });
}

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();
const sw = new UVServiceWorker();

self.addEventListener("install", () => {
  self.skipWaiting();
});

async function handleRequest(event) {
  if (sw.route(event)) {
    return sw.fetch(event);
  }

  await scramjet.loadConfig();
  if (scramjet.route(event)) return scramjet.fetch(event);

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
