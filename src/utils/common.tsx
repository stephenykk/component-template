import { sourceCodeEnum } from '../enums';


export const tagNameMap = {
  dingding: ['dt-open-data', 'open-id', ' open-type'],
  weixin: ['ww-open-data', 'openid', 'type'],
  abookcrypto: ['xx-open-data', 'openid', 'type'],
}
export function getRegExp(type) {
  return new RegExp('^\\$' + type + '=([^$]+)\\$$');
}

export const regExpMap = {
  userName: getRegExp('userName'),
  departmentName: getRegExp('departmentName'),
  userTitle: getRegExp('userTitle'),
  itemName: getRegExp('(userName|departmentName|userTitle)'),
  allItem: new RegExp('\\$(userName|departmentName|userTitle)=([^$]+)\\$', 'g')
}

/**
 * 获取所有的 要素 功能点
 * @returns
 */
 const getAllFunctions = () => {
   try {
      return JSON.parse(window.sessionStorage.getItem('yxt_factors')) || {}
   } catch(e) {
     console.error(e)
     return {}
   }
};

/**
 * 检查对应的功能点的状态(处理已过期的状态)
 * @param {*} point
 * 2.要素上架-已购买未过期（启用）-显示
 */
 const checkTimeOutFnc = (point) => {
  const localFactors = getAllFunctions();
  return localFactors[point] && localFactors[point].webState;
};
/**
 * 是通讯录加密环境，且未过期
 * @returns 
 */
export const isAbookCrypto = () => {
  const webState = checkTimeOutFnc('address_book_encryption')
  return webState === 2
}

export function ignoreElement(tagNames: string | string[], Vue: any) {
  if (typeof tagNames === 'string') {
    tagNames = [ tagNames ]
  }
  const { ignoredElements = [] } = Vue.config;
  tagNames.forEach(tagName => {
    if (ignoredElements.includes(tagName) === false) {
      ignoredElements.push(tagName);
    }
  })

  Vue.config.ignoredElements = ignoredElements;
}

export const openPlatform = function () {
  const code = localStorage.sourceCode
  if (sourceCodeEnum.weixin === code) {
    return 'weixin'
  } else if (sourceCodeEnum.dingding === code) {
    return 'dingding'
  } else if(isAbookCrypto()) {
    return 'abookcrypto'
  }
  return 
};

export const isOpenPlatform = function () {
  return !!openPlatform()
};


export function checkOpenType(type: string) {
  const isDingding = localStorage.sourceCode === sourceCodeEnum.dingding;

  const validTypes = ['userName', 'departmentName'];

  if (isDingding) {
    validTypes.push('userTitle');
  }
  const isOpenP = isOpenPlatform() && validTypes.includes(type);
  if (isOpenP) {
    return true
  } else {
    console.warn('no support type;type=', type)
    return false
  }
}

export const renderItemTag = (h: OD.Fn, openid, type) => {
  if (localStorage.sourceCode === sourceCodeEnum.dingding) {
    return ((
      // @ts-ignore
      <yxtbiz-dd-open-data
        type={type === 'departmentName' ? 'deptName' : type}
        openid={openid}
      />
    ) as JSX.Element)
  } else if (localStorage.sourceCode === sourceCodeEnum.weixin) {
    return (
      // @ts-ignore
      <yxtbiz-ww-open-data type={type} openid={openid} />
    )
  } else if(isAbookCrypto()) {
    return (
      // @ts-ignore
      <yxtbiz-open-data type={type} openid={openid} />
    )
  } else {
    // @ts-ignore
    return <span class="yxt-open-value">none</span>
  }
}


export const getOpenDataMatchHtml = (text) => {
  return text.replace(regExpMap.allItem, function (matchVal, p1, p2, offset) {
    const tagP = tagNameMap[openPlatform()]
    var tagName = tagP[0];
    var idName  = tagP[1];
    var typeName = tagP[2];
    return `<${tagName} ${typeName}="${p1}" ${idName}="${p2}" ></${tagName}>`;
  });
};

export const getOpenDataMatch = (h: OD.Fn, text) => {
  const nodes = []
  let offsetStart = 0;
  text.replace(regExpMap.allItem, function (matchVal, p1, p2, offset) {
    var openid = p2
    var type = p1
    if (offset>0) {
      nodes.push(text.substring(offsetStart, offset))
      offsetStart = offset
    }
    offsetStart += matchVal.length
    if (openid && checkOpenType(type)) {
      nodes.push(renderItemTag(h, openid, type))
    }
    return matchVal
  });

  if (offsetStart < text.length) {
    nodes.push(text.substr(offsetStart))
  }

  return h("span", {
    "class": "yxt-open-data-match"
  }, nodes);
};
/**
 * 用于处理微信开放数据的名称
 * @param  {createElement} h 必传，使当前方法支持JSX语法
 * @param  {string} name 原名称数据
 * @param  {string} type userName： 匹配的是用户名，departmentName：匹配的是部门名
 * @return {JSX} rander 对象
 */
export const getOpenDataJSX = (h: OD.Fn, name: string, type: string, split: string) => {

  if (!name || checkOpenType(type) === false) {
    // @ts-ignore
    return <span class="yxt-open-value">{name}</span>;
  }

  // 解析出用于呈现的源数据
  const tags = name.split(split).map((val) => {
    const matched = val.match(regExpMap[type]);
    const openid = matched && matched[1];
    if (!openid) {
      return val;
    } 
    return renderItemTag(h, openid, type)
  });

  // 单元素不包含外层节点
  if (tags.length === 1 && typeof tags[0] !== 'string') return tags[0];

  // 多元素包含外层节点
  const children: any[] = [];
  tags.forEach((data, index) => {
    if (index) children.push(split);
    children.push(data);
  });
  
  // @ts-ignore
  return <span class="yxt-open-data-wrap">{children}</span>;
};


/**
 * 用于处理微信开放数据的名称，去除模板
 * @param  {string} name 原名称字符串，内容可混合带有模板的数据
 * @return {string} 返回企业微信中的名称，去除多余模板
 */
 export const getOpenData = name => {
  if (!name) return '';
  const re = /\$(?:(?:userName)|(?:departmentName))=([^$]+)\$/g;
  return name.replace(re, (m, value) => value);
};
export const decorateAttachShadow = () => {
  const { attachShadow = '' } = Element.prototype
  const done = attachShadow.toString().indexOf('native code') === -1
  if (done) return

  // @ts-ignore
  Element.prototype._oriAttachShadow = attachShadow || function() { console.log('no attachShadow') }
  Element.prototype.attachShadow = function(option: any = {}) {
    return this._oriAttachShadow({...option, mode: 'open'})
  }
}

export const getOpenValue = (openId: string, isDingding: boolean) => {
  const [tagName, attrName] = tagNameMap[isDingding ? 'dingding' : openPlatform()]
  const selector = `${tagName}[${attrName}="${openId}"]`
  const ele = document.querySelector(selector)

  if (!ele) {
    console.warn(`not found ${selector}`)
    return 
  }

  return ele.shadowRoot ? ele.shadowRoot.textContent : ''
}
