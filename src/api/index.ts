import Api, { http, envNow, getMedia } from './main';
import config from './config';

/* istanbul ignore next */
Api.install = function(Vue, config = {}) {
  if(typeof Vue === 'object') {
    config = Vue;
  }
  Api.setConfig(config);
};

const {
  // udpApi,
  // oteApi,
  // cerApi,
  core,
  // commonApi,
  // ccApi,
  // fileApi,
  // surveyApi,
  // placeApi,
  // teApi,
  // logApi,
  // decorateApi,
  // utilityApi,
  // msgApi,
  // kngApi,
  // knglibApi,
  // enrollApi,
  // sspApi,
  // newsApi,
  // o2oApi,
  // bbsApi,
  // bsetApi,
  // searchApi,
  // omsApi,
  // supportApi,
  // imApi,
  orginit: orgInit,
  // tcmApi,
  globalApi
} = http;

export {
  // udpApi,
  // oteApi,
  // cerApi,
  core,
  // commonApi,
  // ccApi,
  // fileApi,
  // surveyApi,
  // placeApi,
  // teApi,
  // logApi,
  // decorateApi,
  // utilityApi,
  // msgApi,
  // kngApi,
  // knglibApi,
  // enrollApi,
  // sspApi,
  // newsApi,
  // o2oApi,
  // bbsApi,
  // bsetApi,
  // searchApi,
  // omsApi,
  // supportApi,
  // imApi,
  config,
  envNow,
  getMedia,
  orgInit,
  // tcmApi,
  globalApi
};

export default Api;
