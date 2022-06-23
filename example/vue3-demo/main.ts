// @ts-ignore
import Vue from 'vue';

// @ts-ignore
import App from './app.vue'

import YxtOpenData from '@/index';

// webpack项目 用import
// import {createApp, h} from 'vue'
const {createApp, h} = Vue;

const app = createApp(App)
app.use(YxtOpenData, {
  h,
  env: 'dev',
  domain: { orginit: '//api-orginit-phx.yunxuetang.com.cn/v2/' }
});

app.mount('#app')