/*eslint-disable */

// urlsShouldCache inject
const CACHE_TYPES = {
  ALWAYS_CACHE: 1,
  PREV_CACHE: 2, 
  SESSION_CACHE: 3,
  TIME_CACHE: 4,
  VERSION_CACHE: 5
}

var CACHE_NAMES = {}
Object.keys(CACHE_TYPES).forEach(function (nameKey) {
  let cacheName = `SW-${nameKey}`;
  CACHE_NAMES[CACHE_TYPES[nameKey]] = cacheName;
  CACHE_NAMES[nameKey] = cacheName;
});

let cacheConfig = [
  {
    test: /^https:\/\/img-oss\.yunshanmeicai\.com\/supply\/mobile-im\/.*\.(css|js)$/i,
    type: CACHE_TYPES.VERSION_CACHE
  },
  {
    test: /^https:\/\/img-oss\.yunshanmeicai\.com\/supply\/supplynweb\/.*\.(css|js)$/i,
    type: CACHE_TYPES.ALWAYS_CACHE
  }
];

//$inject-placeholder

cacheConfig = projectCacheConfig.concat(cacheConfig);

// sw安装事件，增量更新version缓存
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAMES.VERSION_CACHE).then(function (cache) {
    return cache.keys().then(function (requests) {
      return new Promise(function (resolve, reject) {
        let assetsCached = requests.map(function (request) {
          let url = request && request.url
          return url
        })
        urlsShouldCache = urlsShouldCache.filter(function (shouldCacheUrl) {
          if (/\.(css|js)$/.test(shouldCacheUrl)) {
            if (assetsCached.includes(shouldCacheUrl)) {
              return false
            }
            return true
          }

          return true
        })
        cache.addAll(urlsShouldCache).then(function () {
          resolve(self.skipWaiting())
        }).catch(function (err) {
          reject(err)
        })
      })
    })
  }))
});

//激活事件，删除 version-cache 中不使用的资源
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.open(CACHE_NAMES.VERSION_CACHE).then(function (cache) {
    return cache.keys().then(function (requests) {
      return Promise.all(requests.map(function (request) {
        let url = request && request.url
        if (urlsShouldCache.indexOf(url) === -1) {
          return cache.delete(url)
        }
        return Promise.resolve()
      }))
    })
  }))
})

//fetch事件
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return
  let request = event.request
  let url = request.url
  let cacheType = cacheConfig.find(function (cache) {
    return cache.test.test(url)
  })
  let requestOption;
  if (customerHeaderKeys && customerHeaderKeys.length) {
    requestOption = { headers: {} };
    customerHeaderKeys.forEach(function (key) {
      let headers = request.headers;
      if (headers && headers.get && headers.get(key)) {
        requestOption.headers[key] = headers.get(key);
      }
    })
  }
  if (cacheType) {
    if (cacheType.type === CACHE_TYPES.ALWAYS_CACHE || cacheType.type === CACHE_TYPES.PREV_CACHE || cacheType.type === CACHE_TYPES.VERSION_CACHE) {
      let cacheName = null
      switch (cacheType.type) {
        case CACHE_TYPES.ALWAYS_CACHE:
          cacheName = CACHE_NAMES.ALWAYS_CACHE
          break
        case CACHE_TYPES.PREV_CACHE:
          cacheName = CACHE_NAMES.PREV_CACHE
          break
        case CACHE_TYPES.VERSION_CACHE:
          cacheName = CACHE_NAMES.VERSION_CACHE
          break
      }
      if (cacheName) {
        if (cacheType.credentials) {
          if (!requestOption) {
            requestOption = {};
          }
          requestOption.credentials = cacheType.credentials;
        }
        event.respondWith(caches.open(cacheName).then(function (cache) {
          return cache.match(request).then(function (response) {
            if (response && response.ok) {
              if (cacheType.type === CACHE_TYPES.PREV_CACHE) {
                fetchRequest(request, requestOption, cache)
              }
              return response
            } else {
              return fetchRequest(request, requestOption, cache)
            }
          })
        }))
      }
    }
  }
  return;
})

// 请求并缓存响应
function fetchRequest(request, requestOption, currentCache) {
  if (request) {
    return fetch(request.url, requestOption || undefined).then(function (response) {
      if (response && response.ok) {
        currentCache.put(request, response.clone())
      }
      return response
    })
  }
}

// error-event-listener
self.addEventListener('error', function (event) {
  console.error(event)
})
// error-event-listener
self.addEventListener('unhandledrejection', function (event) {
  console.error(event)
})

//polyfill code
if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request])
  }
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this
    return Promise.resolve()
      .then(function () {
        if (arguments.length < 1) throw new TypeError()

        requests = requests.map(function (request) {
          if (request instanceof Request) {
            return request
          } else {
            return String(request)
          }
        })

        return Promise.all(requests.map(function (request) {
          if (typeof request === 'string') {
            request = new Request(request)
          }

          return fetch(request.clone())
        }))
      })
      .then(function (responses) {
        return Promise.all(responses.map(function (response, i) {
          return cache.put(requests[i], response)
        }))
      })
      .then(function () {
        return undefined
      })
  }
}

if (!CacheStorage.prototype.match) {
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this
    return caches.keys().then(function (cacheNames) {
      var match
      return cacheNames.reduce(function (chain, cacheName) {
        return chain.then(function () {
          return match || caches.open(cacheName).then(function (cache) {
            return cache.match(request, opts)
          }).then(function (response) {
            match = response
            return match
          })
        })
      }, Promise.resolve())
    })
  }
}