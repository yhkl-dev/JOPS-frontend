import request from '@/utils/request'

// task
export function getTaskLists(params) {
  return request({
    url: '/task/',
    method: 'get',
    params
  })
}

export function executeTask(id, data) {
  return request({
    url: '/task/' + id + '/',
    method: 'PATCH',
    data
  })
}

export function createTask(data) {
  return request({
    url: '/task/',
    method: 'POST',
    data
  })
}

export function deleteTask(id) {
  return request({
    url: '/task/' + id + '/',
    method: 'delete'
  })
}
// Ad-Hoc task
export function getAdhocTaskLists(params) {
  return request({
    url: '/adhoc_task/',
    method: 'get',
    params
  })
}

export function executeAdhocTask(id, data) {
  return request({
    url: '/adhoc_task/' + id + '/',
    method: 'PATCH',
    data
  })
}

export function createAdhocTask(data) {
  return request({
    url: '/adhoc_task/',
    method: 'POST',
    data
  })
}

export function deleteAdhocTask(id) {
  return request({
    url: '/task/' + id + '/',
    method: 'delete'
  })
}
