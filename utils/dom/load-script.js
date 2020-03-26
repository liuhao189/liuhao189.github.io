function loadScript(url) {
  return new Promise((resolve, reject) => {
    if (!url) reject(new Error(`url is null of undefined`));
    let existedScriptEl = document.querySelector(`script[src='${url}']`);
    if (existedScriptEl) {
      resolve();
      return;
    }
    let scriptEl = document.createElement('script');
    scriptEl.src = url;
    scriptEl.onload = () => {
      setTimeout(() => {
        resolve()
      }, 0);
    }
    scriptEl.onerror = (err) => {
      document.body.removeChild(scriptEl);
      reject(err)
    }
    document.body.appendChild(scriptEl);
  })
}