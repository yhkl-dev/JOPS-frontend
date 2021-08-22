import request from '@/utils/request'

// 获取资源列表
export function getResourceList(params) {
  return request({
    url: '/resource/',
    method: 'get',
    params
  })
}

// 获取资源类型列表
export function getResourceTypeList(params) {
  return request({
    url: '/resourceType/',
    method: 'get',
    params
  })
}

// 根据资源id查询该条数据
export function getResourceUsereById(id) {
  return request({
    url: '/resourceUser/' + id + '/',
    method: 'get'
  })
}

// 根据资源用户id查询该条数据
export function getResourceUserById(id) {
  return request({
    url: '/resourceUser/' + id + '/',
    method: 'get'
  })
}

export function getResourceUser(params) {
  return request({
    url: '/resourceUser/',
    method: 'get',
    params
  })
}

// 添加资源
export function addResource(data) {
  return request({
    url: '/resource/',
    method: 'post',
    data
  })
}

// 添加资源用户
export function addResourceUser(data) {
  return request({
    url: '/resourceUser/',
    method: 'post',
    data
  })
}

// 更新资源
export function updateResource(id, data) {
  return request({
    url: '/resource/' + id + '/',
    method: 'put',
    data
  })
}

// 更新管理员登录资源时间
export function updateResourceLoginTime(id, data) {
  return request({
    url: '/resource/' + id + '/',
    method: 'PATCH',
    data
  })
}

export function updateResourceUser(id, data) {
  return request({
    url: '/resourceUser/' + id + '/',
    method: 'put',
    data
  })
}

export function deleteResoure(id) {
  return request({
    url: '/resource/' + id + '/',
    method: 'delete'
  })
}

export function getVncHostAndPort(params) {
  return request({
    url: '/noVnc/',
    method: 'POST',
    data: params
  })
}

export function getMyResources(params) {
  return request({
    url: '/resourceUser/',
    method: 'get',
    params
  })
}

export function deleteResourceUser(id) {
  return request({
    url: '/resourceUser/' + id + '/',
    method: 'delete'
  })
}

export function addMyResourceUser(params) {
  return request({
    url: '/resourceUser/',
    method: 'post',
    data: params
  })
}

export function getProductTree() {
  return request({
    url: '/productManage/',
    method: 'get'
  })
}

export function getProductLevel(params) {
  return request({
    url: '/products/',
    method: 'get',
    params
  })
}

export function addProduct(params) {
  return request({
    url: '/products/',
    method: 'post',
    data: params
  })
}

export function getProductLevelInfo(id) {
  return request({
    url: '/products/' + id + '/',
    method: 'get'
  })
}

export function updateProduct(id, params) {
  return request({
    url: '/products/' + id + '/',
    method: 'put',
    data: params
  })
}
export function deleteProductLevelInfo(id) {
  return request({
    url: '/products/' + id + '/',
    method: 'delete'
  })
}

export function getProductList() {
  return request({
    url: '/productList/',
    method: 'get'
  })
}

export function getSystemInfo() {
  return request({
    url: '/systemInfo/',
    method: 'get'
  })
}
