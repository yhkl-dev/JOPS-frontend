import request from '@/utils/request'

export function getMessage(params) {
  return request({
    url: '/messages/',
    method: 'get',
    params
  })
}

export function updateMessageStatus(id, params) {
  return request({
    url: '/messages/' + id + '/',
    method: 'patch',
    data: params
  })
}
