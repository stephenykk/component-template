import axios from 'axios';

export const config = {
  dev: {
    core: '//api-core-phx.yunxuetang.com.cn/v2/',
    media: '//media-phx.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx.yunxuetang.com.cn/v2/',
    globalApi: '//api-global-phx.yunxuetang.com.cn/v2'
  },
  stg: {
    core: '//api-core-phx-ucstable.yunxuetang.com.cn/v2/',
    media: '//media-phx-ucstable.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx-ucstable.yunxuetang.com.cn/v2/',
    globalApi: '//api-global-phx-ucstable.yunxuetang.com.cn/v2/'
  },
  prod: {
    core: '//api-core-phx.yunxuetang.cn/v2/',
    media: '//media-phx.yunxuetang.cn/',
    orginit: '//api-orginit-phx.yunxuetang.cn/v2/',
    globalApi: '//api-global-phx.yunxuetang.cn/v2/'
  },
  tcstress: {
    core: '//api-core-phx-tcstress.yunxuetang.cn/v2/',
    media: '//media-phx-ucstable.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx-tcstress.yunxuetang.cn/v2/',
    globalApi: '//api-global-phx-tcstress.yunxuetang.cn/v2/'
  },
  hwcloud: {
    core: '//api-core-phx-kp.yunxuetang.com.cn/v2/',
    media: '//media-phx-kp.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx.yunxuetang.cn/v2/',
    globalApi: '//api-global-phx.yunxuetang.com.cn/v2/'
  },
  kylin: {
    core: '//api-core-phx-kylin.yunxuetang.com.cn/v2/',
    media: '//media-phx-kylin.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx.yunxuetang.cn/v2/',
    globalApi: '//api-global-phx.yunxuetang.com.cn/v2/'
  },
  feature: {
    core: '//api-core-phx-feat.yunxuetang.com.cn/v2/',
    media: '//media-phx-feat.yunxuetang.com.cn/',
    orginit: '//api-orginit-phx-feat.yunxuetang.com.cn/v2/',
    globalApi: '//api-global-phx-feat.yunxuetang.com.cn/v2/'
  },
  source: 501
};

export async function getNewConfig(env: OD.Env) {
  try {
    // 下面的接口不支持跨域 并且非https
    const res = await axios.get(
      `http://front-end-conf.yunxuetang.com.cn/project/apis/${env}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf8'
        }
      }
    );
    return res.data;
  } catch (e) {
    console.error('getNewConfig error:', e);
  }
  return false;
}

export async function useNewDomain(env: OD.Env, callback: OD.Fn) {
  const newDomain = await getNewConfig(env);
  if(newDomain) {
    setDomainConfig(env, newDomain)
    if(typeof callback === 'function') {
      callback(newDomain);
    }
  }
}

// 修改上面config对象 指定环境的域名
export function setDomainConfig(env, domain) {
  config[env] = domain;
}

export default config;
