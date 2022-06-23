export default {
  name: 'Hello',
  props: {
    msg: String
  },
  render(h) {
    // -- 获取 h
    // Vue2.x 默认传入 h,
    // Vue3:
    // 1. 可通过Vue.h获得 import * as Vue from 'vue'
    // 2. import {h} from 'vue'
    // console.log('🚀 ~ file: hello.ts ~ line 4 ~ render ~ h', h);

    // -- 获取props vue2和vue3保持一致
    // vue2.x this[propName]
    // vue3 this[propName]
    // console.log('🚀 ~ file: hello.ts ~ line 18 ~ render ~ this.msg', this.msg);

    // -- attrs
    // vue2 属性名会转换为小写 需自己转为 kabebCase  如: my-name
    // vue3 同 vue2
    // return h('h1', {'my-name': 'alice', 'myAge': 12, style: {marginRight: '20px'}}, 'Hello world render fn ok!!');
    // -- style 
    // 字符串值
    return h( 'h5', { attrs: { 'my-name': 'alice', myAge: 12, style: 'background-color: #ddd;' } }, 'Hello world render fn ok!!' + ' msg:' + this.msg );
  }
};
