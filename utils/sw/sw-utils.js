
const SWUtils = (function (SWUtils) {

  let SWConfig = null;

  function setSWConfig(newConfig) {
    SWConfig = newConfig;
  }

  SWUtils.setSWConfig = setSWConfig;

  const defaultConfig = {
    useSW: true,
    swUrl: 'sw.js?version=' + new Date().getTime(),
    cacheSpaceThreshold: 1024 * 1024 * 3,
    onRemainSpaceReachThresholded: () => { },
    checkSpaceTimeout: 3000,
    onError: () => { }
  };

  function getUseConfig() {
    return Object.assign(defaultConfig, SWConfig || {});
  }

  function start() {
    if (!navigator.serviceWorker) {
      console.log(`browser donot support service-worker.`);
      return;
    }
    let configToUse = getUseConfig();

    if (configToUse.useSW) {
      registerServiceWorker().catch(err => {
        configToUse.onError(err);
      });
    } else {
      unRegisterServiceWorker().then(_ => {
        deleteAllSWCaches();
      }).catch(err => {
        configToUse.onError(err);
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          checkSpace();
        }, configToUse.checkSpaceTimeout);
      })
    }

  }

  function checkSpace() {
    let configToUse = getUseConfig();

    if (navigator.storage && typeof navigator.storage.estimate === 'function') {
      navigator.storage.estimate().then(stroageInfo => {
        let quota = stroageInfo.quota || 0;
        let used = stroageInfo.usage || 0;
        let left = quota - used;
        if (left <= configToUse.cacheSpaceThreshold) {
          configToUse.onRemainSpaceReachThresholded({
            quota: quota,
            used: used,
            left: left
          });
        }
      })
    }
  }

  SWUtils.start = start;

  function registerServiceWorker() {
    return navigator.serviceWorker.register(SWConfig.swUrl);
  }

  function unRegisterServiceWorker() {
    return navigator.serviceWorker.getRegistrations().then(registrations => {
      return Promise.all(registrations.map(registration => {
        return registration.unregister();
      }))
    })
  }

  function deleteCaches(keys) {
    let deleteKeys = keys || [];
    return Promise.all(deleteKeys.map(key => {
      return caches.delete(key);
    }));
  }

  SWUtils.deleteCaches = deleteCaches;

  function deleteAllSWCaches() {
    return caches.keys(keys => {
      let cacheKeys = keys || [];
      let swKeys = cacheKeys.filter(keyStr => {
        return keyStr.toUpperCase().indexOf('SW-');
      })
      return deleteCaches(swKeys);
    })
  }

  SWUtils.deleteAllSWCaches = deleteAllSWCaches;

  return SWUtils;

})({});