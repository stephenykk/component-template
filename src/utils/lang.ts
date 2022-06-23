
function isFunction(val: any) {
  return typeof val === 'function';
}

/**
 *
 * @param {Function} fn 普通函数
 * @param {Object}} context 上下文对象
 * @returns promiseFn
 * eg:
 * const promiseFn = promisify((v1, resole, reject) => fetch({success: resolve}))
 * promiseFn(val1)
 */
export function promisify(fn: OD.Fn, context: any = null) {
  return function(...args: any[]): Promise<any> {
    if (!isFunction(fn)) {
      console.warn('fn is not function', fn);
      return Promise.resolve(fn);
    }

    return new Promise((resolve, reject) => {
      return fn.apply(context, [...args, resolve, reject]);
    }).catch(err => {
      console.error('promisify error: ', err);
      return false;
    });
  };
}

/**
 * 大数组转换为二维数组
 * @param {Array} list 数组
 * @param {Number} size 块大小
 * @returns chunks 二维数组
 */
export function toChunks(list: any[], size: number = 10) {
  if (!Array.isArray(list)) {
    console.warn('list not array:', list);
    return list;
  }
  const cloneList = list.slice();
  const chunks = [];
  while (cloneList.length) {
    chunks.push(cloneList.splice(0, size));
  }
  return chunks;
}

export function eachKey(obj: Record<string, any>, fn: OD.Fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key, obj));
}

/**
 * 从对象提取所需字段
 * @param {object} data
 * @param {array} keys
 * @returns object
 * eg:
 * pick({name: 'zhang', age: 12, color: 'blue'}, ['name']) => {name: 'zhang'}
 * pick({name: 'zhang', age: 12, color: 'blue'}, ['name', ['age', 'year']]) => {name: 'zhang', year: 12}
 */
export function pick(data: Record<string, any>, keys: Array<string | Array<string>>) {
  const result: Record<string, any> = {};
  keys.forEach(key => {
    let newKey;
    if (Array.isArray(key)) {
      const [okey, nkey] = key;
      key = okey;
      newKey = nkey;
    } else {
      newKey = key;
    }
    result[newKey] = data[key];
  });
  return result;
}

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), ms);
  });
}



export function createLogger(tag: string) {
  return {
    log(...args: any[]) {
      console.log(`[${tag}]:`, ...args);
    },
    warn(...args: any[]) {
      console.log(`[${tag}]:`, ...args);
    },
    errlog(...args: any[]) {
      console.error(`[${tag}]:`, ...args);
    }
  };
}

export function appendItem(arr: Array<any>, item) {
  if( arr.includes(item) === false) {
    arr.push(item);
  }
  return arr
}

// 驼峰转换为中划线格式 myName -> my-name
export function kabebCase(str: string) {
  str = str.replace(/[A-Z]/g, m => `-` + m.toLowerCase());
  return str.replace(/^-/, '');
}