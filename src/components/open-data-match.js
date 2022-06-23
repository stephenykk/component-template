import { vueUtils } from '../utils';
import { getOpenDataMatch, openPlatform } from '../utils/common';

export default {
  functional: true,
  name: 'YxtbizOpenDataMatch',
  props: {
    text: String
  },
  render: function render(h, {props}) {
    h = vueUtils.geth(h);
    if (!props.text || !openPlatform()) return h('span', props.text);
    return getOpenDataMatch(h, props.text);
  }
};