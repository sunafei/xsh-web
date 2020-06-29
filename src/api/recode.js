import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/recode',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/recode/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/recode/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
