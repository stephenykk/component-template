// eslint-disable-next-line
import { orgInit, core } from '../api';

function getOrgId(method) {
  const orgId = window.localStorage.orgId || '';
  if (!orgId) {
    console.warn(
      '登录成功后 userInfo 的字段都会被写入localStorage，包含 orgId, 用 orgId 查 corpid, 然后初始化SDK...'
    );

    console.error(`${method}: localStorage.orgId 为空`);
    return false;
  }
  return orgId;
}

export const loadConfig = (type: number, url: string, orgid?: string) => {
  const orgId = orgid || getOrgId('loadConfig');
  if (!orgId) return Promise.resolve(false);
  const token = localStorage.token || '';
  return orgInit.post(
    '/wx/corp/jsconfig',
    { orgId, type, url, token },
    { headers: { token } }
  );
};

export const getCorpId = (orgid?: string) => {
  const orgId = orgid || getOrgId('getCorpId');
  if (!orgId) return Promise.resolve(false);
  const token = localStorage.token || '';
  return orgInit.get(
    '/dingding/corpid',
    { orgId, token },
    { headers: { token } }
  );
};


export const getTicketAndGroup = () => {
  return core.get('/auth/ticket')
}