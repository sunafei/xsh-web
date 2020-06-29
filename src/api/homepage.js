import request from '@/utils/request'
export function getList() {
  return request({
    url: '/api/homepage/index',
    method: 'get'
  })
}
