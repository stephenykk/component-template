import { kabebCase, ignoreElement, eachKey, vueUtils, decorateAttachShadow } from '../utils';
import Api from '../api/main';

// @ts-ignore
import DdOpenData from './dd-open-data';
// @ts-ignore
import OpenData from './open-data';
// @ts-ignore
import WwOpenData from './ww-open-data';
// @ts-ignore
import UserName from './user-name';
// @ts-ignore
import PositionName from './position-name';
// @ts-ignore
import DeptName from './dept-name';
// @ts-ignore
import OpenDataMatch from './open-data-match';
// @ts-ignore
import OpenDataHtml from './open-data-html';

const components = {
  DdOpenData,
  OpenData,
  UserName,
  PositionName,
  DeptName,
  WwOpenData,
  OpenDataMatch,
  OpenDataHtml
};

export function install(
  Vue,
  config: {
    env?: string;
    domain?: Record<string, string>;
    autoDomain?: boolean;
    h?: (...args: any[]) => any;
  } = {},
  component?: { name: string; render: OD.Fn; [key: string]: any }
) {
  const registerings = component ? [component] : components;
  // 全局注册组件
  eachKey(registerings, cmpOptions => {
    Vue.component(cmpOptions.name, cmpOptions);
  });

  // YxtbizUserName 等组件单独注册时，
  // 确保也注册 YxtbizOpenData YxtbizDdOpenData
  if (!Vue.component(OpenData.name)) {
    Vue.component(OpenData.name, OpenData);
    Vue.component(DdOpenData.name, DdOpenData);
  }

  ignoreElement(['dt-open-data', 'ww-open-data'], Vue);

  // 设置域名
  if (config.env) {
    Api.setConfig(config);
  }

  const isVue3 = Vue.version.split('.').shift() * 1 >= 3;

  if (isVue3) {
    if (!config.h) {
      const tips = `
        Vue3.x 需传入h方法, 如：
        import { h } from 'vue'
        import YxtOpenData from 'yxt-open-data'
        app.use(YxtOpenData, {h, env, domain})`;
      console.error(tips);
    }
  } else {
    if (config.h) {
      console.error('Vue2.x不需要传入h参数!');
    }
  }

  vueUtils.Vue = Vue;
  vueUtils.h = config.h;
  vueUtils.isVue3 = isVue3;

  vueUtils.h3 = function(...args) {
    let [type, props, ...others] = args;

    // props 扁平化
    // https://vue3js.cn/docs/zh/guide/migration/render-function-api.html#_3-x-%E8%AF%AD%E6%B3%95-3
    if (props.attrs) {
      Object.assign(props, props.attrs);
      delete props.attrs;
    }

    // vue3 h(componentOptions, ...)
    const app = vueUtils.Vue;
    const globalComponents = app._context ? app._context.components : {};
    let targetComponent = type;
    if (typeof type === 'string') {
      eachKey(globalComponents, (cmp, name) => {
        if (kabebCase(name) === kabebCase(type)) {
          targetComponent = cmp;
        }
      });
    }
    return vueUtils.h(targetComponent, props, ...others);
  };

  decorateAttachShadow()
}

// 每个组件添加 install 方法，可单独注册
eachKey(components, component => {
  component.install = function(Vue, config) {
    install(Vue, config, this);
  };
});

export default components;
