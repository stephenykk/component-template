import mockData from '../mock-data';
import {getQuery} from '../../src/utils';
import YxtOpenData from '@/index';

const query = getQuery();
const isDingding = !!query.dingding;

const isvType = isDingding ? 'dingding' : 'weixin';
const mdata = mockData[isvType];

if (isDingding) {
  localStorage.sourceCode = 104;
  localStorage.orgId = mdata.orgId;
}

const { weixin, dingtalk } = YxtOpenData;
const openData = isDingding ? dingtalk.openData : weixin.openData;

// 设置域名
YxtOpenData.Api.install({
  env: 'dev',
  domain: { orginit: '//api-orginit-phx.yunxuetang.com.cn/v2/' }
});

// openData.init(orgId) // 如果能拿到机构id，则传入
openData.init();


function getUsers() {
  return mdata.datas;
}


function render(users) {
  const re = /\$(?:userName|departmentName)=([^\$]+)\$/g;
  const mainHtml = users
    .map(user => {
      let userHtml = '';
      userHtml +=
        '用户名: ' +
        user.fullname.replace(re, (m, id) => openData.tag('user', id));
      
      userHtml +=
        '<br/>部门: ' +
        user.deptName.replace(re, (m, id) => openData.tag('dept', id) );

      return userHtml;
    })
    .join('<hr/>');
    
  const tipsHtml = `
  <section class="tips-section" style="background: #eee; padding: 20px">
      <div class="tips-line">
          <p>钉钉：localhost域名下可用模拟数据预览</p>
          <p>微信: SDK初始化对域名有校验，需要开启https服务, 修改hosts用域名 q-phx.yunxuetang.com.cn 访问</p>
      </div>
  </section>
  `;
  
  const titleHtml = `<h1>测试机构: ${mdata.orgName}</h1>`;

  document.querySelector('#app').innerHTML = tipsHtml + titleHtml + mainHtml;
}

window.onload = function() {
  const users = getUsers();

  render(users);

  openData.debUpdate();
};
