import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/password',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/password/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/password/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}

