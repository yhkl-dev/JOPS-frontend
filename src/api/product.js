import request from '@/utils/request'

// project
export function getProduct(params) {
  return request({
    url: '/product/',
    method: 'get',
    params
  })
}

export function createProduct(data) {
  return request({
    url: '/product/',
    method: 'post',
    data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/product/',
    method: 'post',
    data
  })
}
