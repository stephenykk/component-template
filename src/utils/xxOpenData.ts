import { debounce } from 'throttle-debounce';
import { toChunks, sleep, prependScript, createLogger, appendItem } from './tools';
import { getTicketAndGroup } from '../service';
import { tagNameMap } from './common'

// const isDingTalk = /dingtalk/i.test(navigator.userAgent); // 浏览器端钉钉扫码登录 ua 不是 dingTalk
// const isDingTalk = true; // 浏览器打开二维码联登 钉钉扫码登录,  ua 不是 dingTalk

const openData = {
  orgId: '',
  ready: false, // sdk就绪 可更新元素
  started: false, // 开始初始化
  corpId: '', // 企业在钉钉的企业id
  elements: [] as any[], // 待更新的 xx-open-data 元素列表
  XXOpenData: {},
  ...createLogger('XXOpenData'),
  addElement(ele) {
    appendItem(this.elements, ele);
  },
  async loadSDK(lives = 3, url): Promise<boolean> {
    // 1、SDK 脚本需要放在<head>标签中，并置于其他所有的<script>标签之前，否则SDK无法生效。
    // 2、SDK 内容是动态返回的，请严格按照demo中的方式引入，不要保存到项目本地后打包引入
    // const openDataSDK = 'https://auth.dingtalk.com/opendata-1.1.0.js';
    // !!! SDK容易加载失败 所以加入重试机制
    // debug
    let ok = await prependScript(url);
    this.XXOpenData = window.XXOpenData
    // debug
    this.log('loading sdk lives:', lives);
    if (!ok && lives) {
      await sleep(50);
      return await this.loadSDK(lives - 1, url);
    }
    return true;
  },
  isReady() {
    return this.ready;
  },
  isStarted() {
    return this.started;
  },
  async init(orgId?:string) {
      try {
        this.started = true;

      const ticketRet = await getTicketAndGroup()
      await this.loadSDK(undefined, `${ticketRet.domain}/opendata-1.1.0.js`);

      if (!this.XXOpenData ) {
        this.warn('load sdk fail, XXOpenData', this.XXOpenData );
        this.started = false;
        return;
      }

      this.XXOpenData.initTimes = this.XXOpenData.initTimes || 0;
      this.XXOpenData.initTimes++;

      this.log('this.XXOpenData.initTimes', this.XXOpenData.initTimes);
      this.log('this.XXOpenData.initOK', this.XXOpenData.initOK);

      let initDone = false;

      if (
        typeof customElements !== 'undefined' &&
        typeof customElements.get === 'function'
      ) {
        // customElements.get() 不兼容ie
        const ctor = customElements.get('xx-open-data');
        initDone = !!ctor;
      } else {
        // 其他业务模块都升级bi-h5后 可走到这里
        initDone = this.XXOpenData.initOK;
      }

      if (initDone) {
        this.ready = true;
        setTimeout(() => {
          this.update(true);
        }, 100); // 等待所有open-data的mounted都执行 elements.push(this.$el)
        return;
      }
      const initOK = await this.XXOpenData.init({
        baseUrl: ticketRet.domain,
        ...ticketRet
      });
      this.XXOpenData.initOK = initOK;
      if (initOK) {
        this.ready = true;
        // 首次全量渲染，openid已传入时，会渲染得到名称；openid未传入时 则 open-data watch触发更新
        this.update();
        return
      }
      throw new Error(`open data init error initOK=${initOK}`)
    } catch(e) {
      this.started = false;
      console.error(e)
    }
  },
  
  update(isAll = false) {
    if (!this.XXOpenData.initOK) {
      console.warn('XXOpenData 还没有初始')
      return
    }
    // 1、调用XXOpenData.update方法前，一定要确保 XXOpenData.init 方法已经调用成功，否则update方法无法生效。
    // 2、XXOpenData.update方法一次性传入的dom节点数量不可以超过200个，否则无法正常渲染。
    let cloneEleList

    if (isAll || this.elements.length === 0) {
      cloneEleList = Array.from(document.querySelectorAll('xx-open-data'))
    } else {
      cloneEleList = this.elements.slice()
    }
    if (cloneEleList.length === 0) {
      return
    }
    this.elements = []; // 清空
    const openDataEleChunks = toChunks(cloneEleList, 150); // 分块 使每次更新元素个数小于200
    openDataEleChunks.forEach((chunk, i) => {
      setTimeout(() => {
        window.XXOpenData && window.XXOpenData.update(chunk);
      }, i * 40);
    });
  },
  
  debUpdate: function(ele?: HTMLElement) {
    if (ele) {
      const tagName = tagNameMap.abookcrypto[0]
      ele.tagName.toUpperCase() === tagName.toUpperCase() && this.addElement(ele);
    }
    this._debUpdate(false);
  },

  _debUpdate: debounce(80, (bool = true) => {
    openData.update(bool);
  }),

  tag(shortType: 'user' | 'dept', openid: string) {
    const typeMap = { user: 'userName', dept: 'deptName' };
    const type = typeMap[shortType];

    const tagName = tagNameMap.abookcrypto[0]
    const idName = tagNameMap.abookcrypto[1]
    const typeName = tagNameMap.abookcrypto[2]

    return `<${tagName} ${typeName}="${type}" ${idName}="${openid}" ></${tagName}>`;
  }
};

export default { openData }
