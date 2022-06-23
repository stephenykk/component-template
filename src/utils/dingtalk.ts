import { debounce } from 'throttle-debounce';
import { toChunks, sleep, prependScript, createLogger, appendItem } from './tools';
import { getCorpId } from '../service';
import { decorateAttachShadow, getOpenValue, tagNameMap } from './common'
import { sourceCodeEnum } from '../enums'


// const isDingTalk = /dingtalk/i.test(navigator.userAgent); // 浏览器端钉钉扫码登录 ua 不是 dingTalk
// const isDingTalk = true; // 浏览器打开二维码联登 钉钉扫码登录,  ua 不是 dingTalk

const openData = {
  orgId: '',
  ready: false, // sdk就绪 可更新元素
  started: false, // 开始初始化
  corpId: '', // 企业在钉钉的企业id
  elements: [] as any[], // 待更新的 dt-open-data 元素列表
  ...createLogger('dingTalkOpenData'),
  addElement(ele) {
    appendItem(this.elements, ele);
  },
  async loadSDK(lives = 3): Promise<boolean> {
    // 1、SDK 脚本需要放在<head>标签中，并置于其他所有的<script>标签之前，否则SDK无法生效。
    // 2、SDK 内容是动态返回的，请严格按照demo中的方式引入，不要保存到项目本地后打包引入
    const openDataSDK = 'https://auth.dingtalk.com/opendata-1.1.0.js';
    // !!! SDK容易加载失败 所以加入重试机制
    this.log('loading sdk lives:', lives);
    let ok = await prependScript(openDataSDK);
    if (!ok && lives) {
      await sleep(50);
      return await this.loadSDK(lives - 1);
    }
    return ok;
  },
  getLoginUrl() {
    const callbackUrl = location.href;
    const authUrl = `http://auth.dingtalk.com/login?redirectUri=${encodeURIComponent(
      callbackUrl
    )}`;
    const loginUrl = `https://login.dingtalk.com/oauth2/auth?response_type=code&client_id=dingwa4tibze6jwz7mgv&scope=openid&state=dddd&redirect_uri=${encodeURIComponent(
      authUrl
    )}`;

    return loginUrl;
  },
  async getCorpId(orgId?: string) {
    let { corpId } = (await getCorpId(orgId)) || {};
    if (!corpId) return false;

    this.corpId = corpId;
    return corpId;
  },
  isReady() {
    return this.ready;
  },
  isStarted() {
    return this.started;
  },
  getOpenValue,
  async init(orgId?: string) {
    this.orgId = orgId;
    this.started = true;

    // 重复初始化 若已初始化完成
    // @ts-ignore
    // if(window.DTOpenData.initOK) {
    //   this.started = true;
    //   this.ready = true;
    //   this.update(true);
    //   return;
    // }

    const sourceCode = localStorage.sourceCode
    if (sourceCode !== sourceCodeEnum.dingding) {
      this.warn('init, but not dd isv', sourceCode)
      return;
    }

    await this.getCorpId(orgId);
    this.log('coprId', this.corpId);

    if (!this.corpId) {
      this.errlog('get corpId fail:', this.corpId);
      return;
    }

    decorateAttachShadow()
    
    await this.loadSDK();
    if (!window.DTOpenData) {
      this.warn('load sdk fail, DTOpenData', window.DTOpenData);
      this.started = false;
      return;
    }
    window.DTOpenData.initTimes = window.DTOpenData.initTimes || 0;
    window.DTOpenData.initTimes++;
    this.log('window.DTOpenData.initTimes', window.DTOpenData.initTimes);
    this.log('window.DTOpenData.initOK', window.DTOpenData.initOK);

    let initDone = false;
    if (
      typeof customElements !== 'undefined' &&
      typeof customElements.get === 'function'
    ) {
      // customElements.get() 不兼容ie
      const ctor = customElements.get('dt-open-data');
      initDone = !!ctor;
    } else {
      // 其他业务模块都升级bi-h5后 可走到这里
      initDone = window.DTOpenData.initOK;
    }

    if (initDone) {
      this.started = true;
      this.ready = true;

      setTimeout(() => {
        this.update(true);
      }, 200); // 等待所有open-data的mounted都执行 elements.push(this.$el)
      return;
    }

    // !!! openDataSDK对客户端强依赖，
    // !!! 测试包init()方法会返回false -> 跳登录--回调本页面init() false -> 跳登录 ... 会死循环 ，加最大跳转限制
    const initOK = window.DTOpenData.init(this.corpId);
    this.log('dingding opendata initOK', initOK);

    // @ts-ignore
    window.DTOpenData.initOK = initOK;

    if (initOK) {
      // 入参是开通应用企业的corpId
      // SDK初始化成功，继续执行页面逻辑
      this.started = true;
      this.ready = true;
      // 首次全量渲染，openid已传入时，会渲染得到名称；openid未传入时 则 open-data watch触发更新
      this.update(true);
    } else {
      this.started = false;
      const jumps = (sessionStorage.jumps * 1 || 0) + 1;
      if (jumps < 5) {
        sessionStorage.jumps = jumps;
        // init() fanse, 说明当前用户未登录，需要跳转到钉钉统一登录
        const loginUrl = this.getLoginUrl();
        this.log('go loginUrl:', loginUrl);
        window.location.href = loginUrl;
      }
    }
  },
  update(isAll?: boolean) {
    // 1、调用DTOpenData.update方法前，一定要确保 DTOpenData.init 方法已经调用成功，否则update方法无法生效。
    // 2、DTOpenData.update方法一次性传入的dom节点数量不可以超过200个，否则无法正常渲染。
    // const openDataEles = isAll
    //   ? Array.from(document.querySelectorAll('dt-open-data'))
    //   : this.elements.slice(); // 只更新变动的 dt-open-data
    const openDataEles = this.elements.length
      ? this.elements.slice()
      : Array.from(document.querySelectorAll('dt-open-data'));
    this.elements = []; // 清空

    const openDataEleChunks = toChunks(openDataEles, 150); // 分块 使每次更新元素个数小于200
    openDataEleChunks.forEach((chunk, i) => {
      setTimeout(() => {
        this.log('updating isAll:', isAll);
        this.log(
          'DTOpenData.updating chunk',
          i,
          ',chunk.length:',
          chunk.length
        );
        window?.DTOpenData?.update(chunk);
      }, i * 100);
    });
  },
  debUpdate: function(ele?: HTMLElement) {},
  _debUpdate: debounce(80, () => {
    openData.update(false);
  }),
  tag(shortType: 'user' | 'dept' | 'title', openid: string) {
    const typeMap = { user: 'userName', title: 'userTitle', dept: 'deptName' };
    const type = typeMap[shortType];

    const tagName = tagNameMap.dingding[0]
    const idName = tagNameMap.dingding[1]
    const typeName = tagNameMap.dingding[2]

    return `<${tagName} ${typeName}="${type}" ${idName}="${openid}" ></${tagName}>`;
    // return `<dt-open-data open-type="${type}" open-id="${openid}" ></dt-open-data>`;
  }
};

openData.debUpdate = (ele?: HTMLElement) => {
  if (ele) {
    const tagName = tagNameMap.dingding[0]
    ele.tagName.toUpperCase() === tagName.toUpperCase() && openData.addElement(ele);
  }
  openData._debUpdate();
};

export default {
  openData
};
