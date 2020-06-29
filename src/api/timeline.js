import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/timeline',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/timeline/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/timeline/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
