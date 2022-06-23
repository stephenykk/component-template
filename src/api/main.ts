import axios from 'axios';
import {config, setDomainConfig, useNewDomain } from './config';
// import yxtI18n from 'yxt-i18n';

type API = {
  name: string;
  config: typeof config;
  create: (...args: Array<any>) => any;
  setConfig: (...args: Array<any>) => any;
  [index: string]: any;
}

let Api: API = {
  name: 'Api',
  config,
} as API;

let http: Record<string, any> = {};

const defaultOptions = {
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    source: config.source // add header.source
  },
  validateStatus: (status: number) => {
    return status < 400;
  }
};

const getConfig = (options: Record<string, any>) => {
  options = Object.assign(defaultOptions, options);
  return options;
};

const request = {
  resolve: (config: Record<string, any>) => {
    if (config.method.toLowerCase() === 'get') {
      // 给config.data赋值, 使Content-type起作用
      config.data = true;
    }
    config.headers.token = localStorage.getItem('token'); // add header.token
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return config;
  },
  reject: (error: Record<string, any>) => {
    // eslint-disable-next-line
    return Promise.reject(error);
  }
};

const response = {
  resolve: (response: Record<string, any>) => {
    if (response.status === 201) {
      response.data = response.data || {};
      typeof response.data === 'object' && (response.data.Location = response.headers.location);
    }
    return response.data;
  },
  reject: (error: Record<string, any>) => {
    const data =
      error.response && error.response.data ? error.response.data : {};
    // eslint-disable-next-line
    return Promise.reject(data);
  }
};

type Keys = keyof typeof config.dev;
for (const key in config.dev) {
  const baseURL = config.dev[key as Keys];
  const options = getConfig({
    baseURL,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      source: config.source
    }
  });
  http[key] = axios.create(options);
  http[key].interceptors.request.use(request.resolve, request.reject);
  http[key].interceptors.response.use(response.resolve, response.reject);
  http[key].originGet = http[key].get;
  http[key].get = (url: string, data = {}, config = {}) => {
    data = data.hasOwnProperty('params')
      ? data
      : Object.assign({ params: data }, config || {});
    return http[key].originGet(url, data);
  };
}

type Env = keyof typeof config
type EnvConfig = typeof config['dev']

let envNow = 'dev';
const setConfig = (env = 'dev', source = config.source) => {
  envNow = env;
  if (!window.envConfig) {
    window.envConfig = {};
  }
  const envConfig: EnvConfig = config[env as 'dev']
  window.envConfig.env = envNow; // 设置全局变量
  // 确定环境，则更新axios实例的baseURL
  for (const key in config[env as 'dev']) {
    const api = http[key];
    if(!api) {
      // console.warn('not key inside http:', http, key);
      continue;
    }
    api.defaults.baseURL = config[env as 'dev'][key as 'qidaApi'];
    api.defaults.headers.source = source;
  }
};

Api.setConfig = (options: Record<string, any>) => {
  console.log('[INFO] Api.setConfig options:', options);
  options =
    typeof options === 'string'
      ? { env: options, source: config.source }
      : options;
  
  // 调用方需传入domain, 否则使用默认域名
  if (options.domain) {
    setDomainConfig(options.env, options.domain);
    setConfig(options.env, options.source);
  
  } else {
    if(!options.autoDomain) {
      setConfig(options.env, options.source);
      return;
    }
    
    useNewDomain(options.env, () => {
      setConfig(options.env, options.source);
    });
  } 
  
  // yxtI18n.Api.setConfig(options);
};

Api.create = (options: Record<string, any>) => {
  options = Object.assign(defaultOptions, options);
  const api = axios.create(options);
  api.interceptors.request.use(request.resolve, request.reject);
  api.interceptors.response.use(response.resolve, response.reject);
  return api;
};

let getMedia = () => {
  return config[envNow as 'dev'].media;
};

export { http, envNow, getMedia };
export default Api;
