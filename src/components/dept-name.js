import { getOpenDataJSX, vueUtils } from '../utils';

export default {
  name: 'YxtbizDeptName',
  props: {
    // 部门名称
    name: {
      type: String,
      default: ''
    },
    /**
     * 多名称分隔符，默认‘->’
     */
    split: {
      type: String,
      default: '->'
    }
  },
  render (h) {
    // :( vue3 会传入h传入, h是proxy对象
    h = vueUtils.geth(h);
    return getOpenDataJSX(h, this.name, 'departmentName', this.split);
  }
};
