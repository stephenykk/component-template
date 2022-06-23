<!--
<template>
  <ww-open-data :type="type" :openid="openid" />
</template>
-->
<script>
import { weixin, vueUtils } from '../utils';
const { openData } = weixin;

export default {
  name: 'YxtbizWwOpenData',
  props: {
    /**
     * 开放数据类型
     * type 的合法值 userName: 用户名称 departmentName: 部门名称
     */
    type: String,
    /**
     * 若 type=userName，此时 openid 对应 userid
     * 若 type=departmentName，此时 openid 对应 departmentid
     */
    openid: String
  },
  watch: {
    // 获取到接口数据再渲染列表，openid初始就有值，所以watch不会触发，需要再mounted执行更新
    openid(openid) {
      if (openid) {
        openData.debUpdate(this.$el);
      }
    }
  },
  mounted() {
    // document.querySelectorAll('ww-open-data') 并不能得到全量的open-data节点
    // 因为有的 ww-open-data 被tooltip包装，并没有渲染到页面上
    openData.addElement(this.$el);

    if (!openData.isStarted()) {
      openData.init();
    } else {
      if (openData.isReady()) {
        openData.debUpdate(this.$el);
        // openData.update();
      }
    }
  },
  render(h) {
    h = vueUtils.geth(h);
    return h('ww-open-data', { attrs: {type: this.type, openid: this.openid} })
  }
};
</script>
