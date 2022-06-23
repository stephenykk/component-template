import { dingtalk, vueUtils } from '../utils';

const { openData } = dingtalk;

export default {
  name: 'YxtbizDdOpenData',
  props: {
    type: {
      type: String,
      required: true,
      validator (val) {
        return ['userName', 'userTitle', 'deptName'].includes(val);
      }
    },
    openid: {
      type: String,
      required: true,
      default: ''
    }
  },
  watch: {
    openid (openid) {
      // 通常拿到接口数据才渲染列表，openid初始就有值 所以watch很难触发, 需要在mounted触发更新
      if (window.DTOpenData && openid) {
        // 只更新自己，多个组件，会出现 DTOpenData.update频繁调用；所以用下面的方法优化一下
        // window.DTOpenData.update([this.$el]);
        openData.debUpdate(this.$el);
      }
    }
  },
  async mounted () {
    // document.querySelectorAll('dt-open-data') 并不能得到全量的open-data节点
    // 因为有的 ww-open-data 被tooltip包装，并没有渲染到页面上
    openData.addElement(this.$el);

    if (!openData.isStarted()) {
      await openData.init();
    } else {
      if (openData.isReady()) {
        openData.debUpdate(this.$el);
        // openData.update();
      }
    }
  },
  render (h) {
    h = vueUtils.geth(h);
    return h('dt-open-data', {
      attrs: { 'open-type': this.type, 'open-id': this.openid }
    });
  }
};
