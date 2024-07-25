const CACHE_NAME = "site-cache-v1";

self.addEventListener("install", function (event) {
  event.waitUntil(
    fetch("/urlsToCache.json")
      .then((response) => response.json())
      .then((urls) => {
        return caches.open(CACHE_NAME).then(function (cache) {
          console.log("Opened cache");
          return cache.addAll(urls).catch(function (error) {
            console.error("Failed to cache:", error);
            throw error;
          });
        });
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
