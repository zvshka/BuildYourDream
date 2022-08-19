// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', async (event) => {
  if (event.data && event.data.action === 'CACHE_NEW_ROUTE') {
    caches.open('others').then((cache) =>
      // @ts-ignore
      // eslint-disable-next-line consistent-return
      cache.match(event.source.url).then((res) => {
        if (res === undefined) {
          // @ts-ignore
          return cache.add(event.source.url);
        }
      })
    );
  }
});
