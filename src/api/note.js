import request from '@/utils/request'
export function getList(params) {
  return request({
    url: '/api/note',
    method: 'get',
    params
  })
}
export function saveOrUpdate(params) {
  return request({
    url: '/api/note/save',
    method: 'post',
    params
  })
}
export function del(id) {
  var url = '/api/note/' + id + '/del'
  return request({
    url: url,
    method: 'get'
  })
}
