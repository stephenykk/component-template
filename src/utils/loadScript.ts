import { promisify } from "./lang";

export const loadScript: OD.LoadScript = (src, allowOnlyOne) => {
  loadScript._cachePromises = loadScript._cachePromises || {};
  const cachePromise = loadScript._cachePromises[src];
  // 若同一脚本 只允许加载一次 且 已有缓存
  if (allowOnlyOne && cachePromise) {
    return cachePromise;
  }

  const loadPromise = new window.Promise((resolve, reject) => {
    const script = document.createElement('script') as OD.Script;
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => {
      reject(false);

      // 加载失败，允许再次加载
      if (allowOnlyOne && loadScript._cachePromises) {
        document.head.removeChild(script);
        delete loadScript._cachePromises[src];
      }
    };

    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        resolve(true);
      }
    };
    // 默认 允许重复加载脚本
    if (!allowOnlyOne) {
      document.head.appendChild(script);
    } else {
      const scriptList = Array.from(document.head.querySelectorAll('script'));
      const isExists = scriptList.some(script => script.src === src);
      if (!isExists) {
        document.head.appendChild(script);
      }
    }
  });

  loadScript._cachePromises[src] = loadPromise;

  return loadPromise;
};



// 在head第一个脚本前插入脚本
export const prependScript = promisify((url, resolve, reject) => {
  return loadJsScript(url, resolve, reject);
});

export function loadJsScript(url: string, callback: OD.Fn, onFail: OD.Fn) {
  const script = document.createElement('script') as OD.Script;
  script.type = 'text/javascript';
  script.src = url;
  script.onload = function() {
    callback(true);
  };
  script.onerror = function(err) {
    console.error('loadScript error:', url, err);
    onFail(false);
    document.head.removeChild(script);
  };
  script.onreadystatechange = function() {
    if (['complete', 'loaded'].includes(this.readyState)) {
      callback(true);
    }
  };

  const scriptList = Array.from(document.head.querySelectorAll('script'));
  const exists = scriptList.find(s => s.src === url);
  if (!exists) {
    const firstScript = scriptList[0];
    document.head.insertBefore(script, firstScript);
  } else {
    callback(true);
    console.warn('script already exists...', url);
  }
}
