import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/anniversary',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/anniversary/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/anniversary/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
