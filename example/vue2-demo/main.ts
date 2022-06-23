// @ts-ignore
import Vue from 'vue';

// @ts-ignore
import App from './app.vue'

import YxtOpenData from '@/index';


YxtOpenData.install(Vue, {
  env: 'dev',
  // autoDomain: true,
  domain: { orginit: '//api-orginit-phx.yunxuetang.com.cn/v2/' }
});

new Vue({
    el: '#app',
    render: (h) => h(App)
});
