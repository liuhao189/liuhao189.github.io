const cacheNamePrefix = 'liuhao189';

const CACHE_TYPES = {
    ALWAYS_CACHE: 1,
    PREV_CACHE: 2,
    SESSION_CACHE: 3,
    TIME_CACHE: 4,
    VERSION_CACHE: 5
};
let CACHE_NAMES = {};
Object.keys(CACHE_TYPES).forEach(function (nameKey) {
    CACHE_NAMES[nameKey] = cacheNamePrefix + nameKey;
});

let cacheConfig = [{
    test: /^https:.*github.io.*(.jpg|.jpeg|.png|.css|.js)/,
    type: CACHE_TYPES.ALWAYS_CACHE
}];

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') return;
    let request = event.request;
    let url = request.url;
    let cacheType = cacheConfig.find(function (cache) {
        return cache.test.test(url);
    });
    if (cacheType) {
        if (cacheType.type === CACHE_TYPES.ALWAYS_CACHE || cacheType.type === CACHE_TYPES.PREV_CACHE || cacheType.type === CACHE_TYPES.VERSION_CACHE) {
            let cacheName = null;
            switch (cacheType.type) {
                case CACHE_TYPES.ALWAYS_CACHE:
                    cacheName = CACHE_NAMES.ALWAYS_CACHE;
                    break;
                case CACHE_TYPES.PREV_CACHE:
                    cacheName = CACHE_NAMES.PREV_CACHE;
                    break;
                case CACHE_TYPES.VERSION_CACHE:
                    cacheName = CACHE_NAMES.VERSION_CACHE;
                    break;
            }
            if (cacheName) {
                let requestOption = undefined;
                if (cacheType.credentials) {
                    requestOption = { credentials: cacheType.credentials };
                }
                event.respondWith(caches.open(cacheName).then(function (cache) {
                    return cache.match(request).then(function (response) {
                        if (response && response.ok) {
                            if (cacheType.type === CACHE_TYPES.PREV_CACHE) {
                                fetchRequest(request, requestOption, cache);
                            }
                            return response;
                        } else {
                            return fetchRequest(request, requestOption, cache);
                        }
                    });
                }));
            }
        }
    } else {
        return;
    }
});

function fetchRequest(request, requestOption, currentCache) {
    if (request) {
        return fetch(request.url, requestOption || undefined).then(function (response) {
            if (response && response.ok) {
                currentCache.put(request, response.clone());
            } else {
                sendErrors(`StatusCode:${response.status},StatusText:${response.statusText},Url:${request.url}`);
            }
            return response;
        });
    }
}

self.addEventListener('error', function (event) {
    console.error(event);
    sendErrors(event.reason && event.reason.message || 'error');
})

self.addEventListener('unhandledrejection', function (event) {
    console.error(event);
    sendErrors(event.reason && event.reason.message || 'unhandledrejection');
});

function sendErrors(msg, isUpdate) {
    self.clients.matchAll().then(function (clients) {
        if (clients && clients.length) {
            let client = clients.find(function (client) { return client.visibilityState === 'visible' });
            if (!client) {
                client = clients[0];
            }
            if (!isUpdate) {
                client.postMessage({ type: 'SW-ERROR', message: msg });
            } else {
                client.postMessage({ type: 'SW-UPDATE', message: msg });
            }
        }
    })
}

if (!Cache.prototype.add) {
    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}

if (!Cache.prototype.addAll) {
    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;
        return Promise.resolve()
            .then(function () {
                if (arguments.length < 1) throw new TypeError();

                requests = requests.map(function (request) {
                    if (request instanceof Request) {
                        return request;
                    } else {
                        return String(request);
                    }
                });

                return Promise.all(requests.map(function (request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    return fetch(request.clone());
                }));
            })
            .then(function (responses) {
                return Promise.all(responses.map(function (response, i) {
                    return cache.put(requests[i], response);
                }));
            })
            .then(function () {
                return undefined;
            });
    };
}

if (!CacheStorage.prototype.match) {
    CacheStorage.prototype.match = function match(request, opts) {
        var caches = this;
        return caches.keys().then(function (cacheNames) {
            var match;
            return cacheNames.reduce(function (chain, cacheName) {
                return chain.then(function () {
                    return match || caches.open(cacheName).then(function (cache) {
                        return cache.match(request, opts);
                    }).then(function (response) {
                        match = response;
                        return match;
                    });
                });
            }, Promise.resolve());
        });
    };
}