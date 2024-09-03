const CACHE_NAME = "site-cache-v1";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return fetch("/urls-to-cache.json")
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to fetch urls-to-cache.json");
          }
          return response.json();
        })
        .then(function (urlsToCache) {
          return Promise.all(
            urlsToCache.map(function (url) {
              return cache
                .add(url)
                .then(function () {
                  console.log(`Successfully cached ${url}`);
                })
                .catch(function (error) {
                  console.error(`Failed to cache ${url}:`, error);
                });
            })
          );
        })
        .catch(function (error) {
          console.error("Failed to cache files during installation:", error);
        });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(function (error) {
        console.error("Network request failed and no cache available:", error);
      });
    })
  );
});
