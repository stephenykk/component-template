import { createLogger, loadScript, promisify, pick, sleep, appendItem } from './tools';
import { debounce } from 'throttle-debounce';
import { loadConfig } from '../service';
import { decorateAttachShadow, getOpenValue, tagNameMap } from './common'
import { sourceCodeEnum } from '../enums'


/**
 * 用于处理微信开放数据的名称，去除模板
 * @param  {string} name 原名称字符串，内容可混合带有模板的数据
 * @return {string} 返回企业微信中的名称，去除多余模板
 */
export const getOpenData = (name: string) => {
  if (!name) return '';
  const re = /\$(?:(?:userName)|(?:departmentName))=([^$]+)\$/g;
  return name.replace(re, (m, value) => value);
};

// 获取当前用于微信鉴权的url
export const getDomain = () =>
  (process.env.NODE_ENV === 'development' && localStorage.MOCK_DOMAIN) ||
  location.href.split('#')[0];

const isWeixin = !!navigator.userAgent.match(/wxwork|wechat|micromessager/i);

async function wxConfig(orgId?: string) {
  // 非微信相关的客户端， wx.config() 调用无效，不会回调 ready 和 error
  // 所以，非微信相关客户端，不执行wx.config()

  // wx.config 方法来自 SDK(jweixin.js)

  if(!isWeixin) {
    openData.log('非微信/企微 跳过wx.config()调用')
    return true;
  }

  const url = getDomain(); // 'https://m-orginit-phx.yunxuetang.com.cn/'; // 需要根据环境配置
  const configRes = await loadConfig(0, url, orgId);
  if (!configRes) {
    console.error('load weixin config error', configRes);
    return false;
  }

  /*
  appId  必填，企业微信的corpID
  timestamp  必填，生成签名的时间戳
  nonceStr  必填，生成签名的随机串
  signature 必填，签名，见 附录-JS-SDK使用权限签名算法
  */
  const newConfig = pick(configRes, [
    'appId',
    'timestamp',
    'nonceStr',
    'signature'
  ]);

  const defaultConfig = {
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: !!localStorage.isDebug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    jsApiList: [
      'scanQRCode',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'getNetworkType',
      'onMenuShareQQ',
      'onMenuShareQZone',
      'openDefaultBrowser'
    ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  };

  const config = { ...defaultConfig, ...newConfig };
  const myWxConfig = promisify((resolve: OD.Fn, reject: OD.Fn) => {
    console.info('wx.config', config);
    wx.config(config);
    wx.ready(() => resolve(true));
    wx.error(() => reject(false));
  });
  const configOK = await myWxConfig();
  return configOK;
}

async function agentConfig(orgId?: string) {
  // wx.agentConfig() 在任何端都能调用

  const url = getDomain(); // 'https://m-orginit-phx.yunxuetang.com.cn/'; // 需要根据环境配置

  const configRes = await loadConfig(1, url, orgId);
  if (!configRes) {
    console.error('load weixin agentConfig error', configRes);
    return false;
  }
  const newConfig = pick(configRes, [
    ['appId', 'corpid'],
    ['agentId', 'agentid'],
    'timestamp',
    'nonceStr',
    'signature'
  ]);
  const myWxAgentConfig = promisify((resolve: OD.Fn, reject: OD.Fn) => {
    wx.agentConfig({
      ...newConfig,
      jsApiList: ['selectExternalContact'],
      success: (res: any) => {
        resolve(res);
        // console.info('wx.agentConfig success', res);
      },
      fail: (res: any) => {
        // if (res.errMsg.indexOf('function not exist') > -1) {
        //   alert('版本过低请升级');
        // }
        console.error(res.errMsg);
        reject(res);
      }
    });
  });

  const configOK = await myWxAgentConfig();
  return configOK;
}

const openData = {
  orgId: '',
  elements: [],
  sdkReady: false,
  configOK: false,
  agentOK: false,
  hasSetup: false,
  hasLogin: false,
  // onlyWeixin: false, // true: 仅支持企微、微信客户端, false: 任何客户端
  started: false,
  ...createLogger('weixinOpenData'),
  addElement(ele) {
    appendItem(this.elements, ele);
  },
  isStarted() {
    return this.started;
  },
  isReady() {
    return this.sdkReady && this.hasSetup;
  },
  async loadSDK(lives = 3): Promise<boolean> {
    // if (this.sdkReady) return;
    // this.sdkReady = true;

    let bothOK = true;

    // loadScript allowOnlyOne 避免重复加载
    if (!window.wx) {
      const ok = await loadScript(
        'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
        true
      );
      this.log('load sdk jweixin ok:', ok, 'lives:', lives);
      bothOK = ok;
    }
    if (!window.WWOpenData) {
      const ok = await loadScript(
        'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js',
        true
      );
      this.log('load sdk jwxwork ok:', ok, 'lives:', lives);
      if (bothOK) {
        bothOK = ok;
      }
    }

    if (!bothOK && lives) {
      await sleep(50);
      return await this.loadSDK(lives - 1);
    }

    return bothOK;
  },
  async wxSetup() {
    let configOK = true;
    let agentOK = true;
    // if (isWeixin && !this.configOK) {
    if (!this.configOK) {
      configOK = await wxConfig(this.orgId);
      this.log('wx.config ok:', configOK);
      this.configOK = configOK; // 防止重复config
    }

    if (!this.agentOK) {
      agentOK = await agentConfig(this.orgId);
      this.log('wx.agentConfig ok:', agentOK);
      this.agentOK = agentOK;
    }

    const bothOK = [configOK, agentOK].every(done => !!done);
    return bothOK;
  },
  async checkSession() {
    // 在企业微信移动端内部，未进行过config时是没有WWOpenData对象的
    if (!window.WWOpenData || !window.WWOpenData.checkSession) return;
    const myCheckSession = promisify((resolve: OD.Fn, reject: OD.Fn) => {
      return window.WWOpenData.checkSession({
        success() {
          // console.log('有登录态');
          resolve(true);
        },
        fail() {
          reject(false);
        }
      });
    });

    const hasLogin = await myCheckSession();
    this.log('checkSession hasLogin:', hasLogin);
    this.hasLogin = hasLogin;
    if (!hasLogin) {
      this.wxSetup();
    }
  },
  getOpenValue,
  async init(orgId?: string, onlyWeixin?: boolean) {
    this.orgId = orgId;
    this.started = true;

    // 通常不用限定是： 企微或微信客户端，比如 企微PC客户端 右上角点击 浏览器打开，其实也要支持open-data正常显示
    // if (onlyWeixin == null) {
    //   onlyWeixin = false
    // }
    // this.onlyWeixin = onlyWeixin

    const sourceCode = localStorage.sourceCode
    if (sourceCode !== sourceCodeEnum.weixin) {
      this.warn('init, not qw isv', sourceCode);
      return;
    }

    decorateAttachShadow();

    this.sdkReady = await this.loadSDK();
    if (!this.sdkReady) {
      this.started = false;
      this.warn('loadsdk fail!');
      return;
    }

    this.hasSetup = await this.wxSetup();
    if (!this.hasSetup) {
      this.started = false;
      this.warn('wxSetup fail:', this.configOK, this.agentOK);
      return;
    }

    await this.checkSession();

    this.log(
      'init finish will bindAll: hasStetup: %s, hasLogin: %s',
      this.hasSetup,
      this.hasLogin
    );

    this.update(true);
  },
  update(isAll: boolean) {
    // 若支持 customElements , 不需执行 bind, 就能转换为名称
    if (window.customElements) {
      this.log('支持 customElements, 不需要调用 bindAll()');
      return;
    }

    if (typeof WWOpenData === 'undefined') {
      this.warn('in update before bindAll, 没有全局对象WWOpenData');
      return;
    }

    const eles = this.elements.length
      ? this.elements
      : Array.from(document.querySelectorAll('ww-open-data'));

    this.elements = [];
    this.log(
      `WWOpenData bindAll elements, total: ${eles.length} isAll: ${isAll}`
    );
    WWOpenData.bindAll(eles);
  },
  debUpdate: function(ele?: HTMLElement) {},
  _debUpdate: debounce(80, () => {
    openData.update(false);
  }),
  tag(shortType: 'user' | 'dept', openid: string) {
    // type 的合法值 userName: 用户名称 departmentName: 部门名称
    const typeMap = { user: 'userName', dept: 'departmentName' };
    const type = typeMap[shortType];

    const tagName = tagNameMap.abookcrypto[0]
    const idName = tagNameMap.abookcrypto[1]
    const typeName = tagNameMap.abookcrypto[2]

    return `<${tagName} ${typeName}="${type}" ${idName}="${openid}" ></${tagName}>`;

    // return `<ww-open-data type="${type}" openid="${openid}" ></ww-open-data>`;
  }
};

openData.debUpdate = (ele?: HTMLElement) => {
  if (ele) {
    ele.tagName.toUpperCase() === 'WW-OPEN-DATA' && openData.addElement(ele);
  }
  openData._debUpdate();
};

export default {
  openData,
  wxConfig,
  agentConfig
};
