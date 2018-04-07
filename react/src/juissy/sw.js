this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(cache => {
      cache.keys().then(console.log);
    }),
  );
});

this.addEventListener('fetch', function(event) {
  console.log(event);
});
