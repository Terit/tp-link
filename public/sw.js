self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('smartplug-cache-v1')
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(['/icon.png']);
      })
  );
});