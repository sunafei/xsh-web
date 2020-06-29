import request from '@/utils/request'
export function get() {
  return request({
    url: '/api/person/',
    method: 'get'
  })
}
export function save(params) {
  return request({
    url: '/api/person/save',
    method: 'post',
    params
  })
}
