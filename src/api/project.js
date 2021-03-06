import request from '@/utils/request'

// project
export function getProjectList(params) {
  return request({
    url: '/project/',
    method: 'get',
    params
  })
}

export function addProject(data) {
  return request({
    url: '/project/',
    method: 'post',
    data
  })
}

export function updateProject(id, params) {
  return request({
    url: '/project/' + id + '/',
    method: 'put',
    data: params
  })
}

// project type
export function getProjectTypeList(params) {
  return request({
    url: '/project_type/',
    method: 'get',
    params
  })
}

export function addProjectList(data) {
  return request({
    url: '/projectList/',
    method: 'post',
    data
  })
}

export function updateProjectList(id, params) {
  return request({
    url: '/projectList/' + id + '/',
    method: 'put',
    data: params
  })
}

export function deleteProjectList(id, params) {
  return request({
    url: '/projectList/' + id + '/',
    method: 'put',
    data: params
  })
}

// project configure
export function addProjectConfigure(data) {
  return request({
    url: '/projectConfigure/',
    method: 'post',
    data
  })
}

export function updateProjectConfigure(id, params) {
  return request({
    url: '/projectConfigure/' + id + '/',
    method: 'put',
    data: params
  })
}

export function deleteProjectConfigure(id) {
  return request({
    url: '/projectConfigure/' + id + '/',
    method: 'delete'
  })
}

