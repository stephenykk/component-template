// @ts-ignore
import Vue from 'vue';

// @ts-ignore
import App from './app.vue'

import YxtOpenData from '@/index';

localStorage.setItem('token', 'eyJhbGciOiJIUzUxMiJ9.eyJvcmdJZCI6ImFjYTQ4YmFjLTE4NGMtNDkxMy04YWM0LTlkZWYyOTMwYmEwNyIsInVzZXJJZCI6IjE4OGMzOTZjLTc1M2MtNDk1NC1iZDA3LTNiNTI3ZDIzNThiMSIsImNsdXN0ZXJJZCI6InYyZGV2IiwiZXhwIjoxNjUwMDExMzUwfQ.XQh9XnyQ8G8kOk83E2uC93BWvm9HC48YNBug3F9vgX_qC5X6GcoSpFclCWOCfG494oHRssq5RTRldooW-ScGnw')

YxtOpenData.install(Vue, {
  env: 'dev',
  // autoDomain: true,
  domain: { orginit: '//api-orginit-phx.yunxuetang.com.cn/v2/' }
});

new Vue({
    el: '#app',
    render: (h) => h(App)
});
