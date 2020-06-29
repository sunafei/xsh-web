import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/cashflow',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/cashflow/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/cashflow/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
export function done(id) {
  return request({
    url: '/api/cashflow/' + id + '/done',
    method: 'get'
  })
}
