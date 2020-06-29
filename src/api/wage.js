import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/wage',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/wage/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/wage/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
