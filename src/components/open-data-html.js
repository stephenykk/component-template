import { vueUtils, getOpenDataClass } from '../utils';
import { getOpenDataMatchHtml, tagNameMap, openPlatform } from '../utils/common';
export default {
  name: 'YxtbizOpenDataHtml',
  props: {
    html: String
  },
  watch: {
    // 获取到接口数据再渲染列表，openid初始就有值，所以watch不会触发，需要再mounted执行更新
    html (val) {
      if (val) {
        this.update()
      }
    }
  },
  mounted: function mounted() {
    
    const { openData } = getOpenDataClass();
    this.openData = openData

    const plat = openPlatform()
      
    if (!plat) return 

    if (openData.isStarted() === false) {
      this.addEle()
      openData.init();
    } else if (openData.isReady()) {
      this.update()
    }
  },
  methods: {
    addEle() {
      const openData = this.openData
      var tagP = tagNameMap[openPlatform()];
      var tagName = tagP[0];
      Array.from(this.$el.querySelectorAll(tagName)).forEach(function (ele) {
        openData.addElement(ele);
      });
    },
    update() {
      const openData = this.openData
      this.addEle()
      openData.update();
    }
  },
  render: function render(h) {
    h = vueUtils.geth(h);

    const plat = openPlatform()

    if (!this.html || !plat) return h("span", {
      "class": "yxt-open-data-html",
      domProps: {
        innerHTML: this.html
      }
    });

    return h("span", {
      "class": "yxt-open-data-html",
      domProps: {
        innerHTML: getOpenDataMatchHtml(this.html)
      }
    });
  }
};