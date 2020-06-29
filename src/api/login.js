import request from '@/utils/request'

export function login(userInfo) {
  return request({
    url: '/api/login',
    method: 'post',
    params: userInfo,
    headers: {
      Authorization: 'Basic c2FmX2NsaWVudDpzYWZfIUAjMTIz'
    }
  })
}
export function gitHubLogin(tokenInfo) {
  return request({
    url: '/auth/token',
    method: 'post',
    params: tokenInfo,
    headers: {
      Authorization: 'Basic c2FmX2NsaWVudDpzYWZfIUAjMTIz'
    }
  })
}
export function getInfo() {
  return request({
    url: '/api/info',
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
export function checkPwd(pwd) {
  var url = '/api/' + pwd + '/check'
  return request({
    url: url,
    method: 'get'
  })
}
