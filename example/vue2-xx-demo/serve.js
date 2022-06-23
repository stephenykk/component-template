const common = window.feConfig.common || {}
const { core } = common || {}

console.debug('core', core)

export const coreApi = axios.create({
  baseURL: core,
  headers: {
    source: 103,
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept-Language': 'zh_CN', // 解决无身份时后端返回语种不正确的问题
    token: localStorage.getItem('token')
  }
})

const resolveFunc = function (response) {
  return response.data
}

const rejectFunc = function (error) {
  if (error.response && error.response.status === 401) {
    return ApiConfig.checkLogin(error.response.data) // 检查token
  }
  let result = (error.response && error.response.data && error.response.data.error) || { key: 'global.service.internal.error.noresponse', message: 'Server exception noresponse' }
  return Promise.reject(result)
}

coreApi.interceptors.response.use(resolveFunc, rejectFunc)


export const getAuthTicket = () => {
  return coreApi.get('/auth/ticket')
}
