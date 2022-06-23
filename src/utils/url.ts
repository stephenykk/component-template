import { eachKey } from "./lang";

/**
 * 解析url参数 得到query对象
 * @param {String} url
 * @returns object query
 */
export const getQuery: OD.GetQuery = (url?: string) => {
  url = url || location.href;
  getQuery._cache = getQuery._cache || {};
  const cacheQuery = getQuery._cache[url];
  if (cacheQuery) {
    return cacheQuery;
  }

  let search = url.split('?')[1] || '';
  search = search.replace(/^\s+|\s+$/g, '');

  const query: Record<string, any> = {};
  search.length &&
    search.split('&').forEach(part => {
      const [key, val] = part.split('=');
      const value = val == null ? val : decodeURIComponent(val);
      query[key] = value;
    });
  getQuery._cache[url] = Object.assign({}, query);
  return query;
};

export function toQueryStr(query = {}) {
  let result: Array<string> = [];
  eachKey(query, (val, key) => {
    result.push(`${key}=${encodeURIComponent(val)}`);
  });
  return result.join('&');
}

export function addQuery(url: string, newQuery: Record<string, any>) {
  const oldQuery = getQuery(url);
  const queryStr = toQueryStr(Object.assign(oldQuery, newQuery));
  return url.split('?')[0] + '?' + queryStr;
}
