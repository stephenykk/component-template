import { openPlatform } from './tools';
export * from './tools';
export { default as weixin } from './weixin';
export { default as dingtalk } from './dingtalk';
export { default as xuanxin } from './xxOpenData';
export { sourceCodeEnum } from '../enums';

export const vueUtils = {
  Vue: null, // Vue or app  (vue2 -> Vue; vue3 -> app)
  h: null, // Vue3 需传入 h 方法
  h3: null, // 参数兼容版的h
  isVue3: false,
  geth(h2: (...args: any[]) => any) {
    return this.isVue3 ? this.h3 : h2;
  }
};

import { default as weixin } from './weixin';
import { default as dingtalk } from './dingtalk';
import { default as xuanxin } from './xxOpenData';

export function getOpenDataClass() {
  switch (openPlatform()) {
    case 'weixin': 
      return weixin
    case 'dingding': 
      return dingtalk
    default: 
      return xuanxin
  }
}
