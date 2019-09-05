
self.addEventListener('fetch', function (event) {
    if (event.request.method === 'GET') return;
});