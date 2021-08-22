import request from '@/utils/request'

export function downloadReports(params) {
  return request({
    url: '/download/',
    method: 'get',
    params: {
      file_name: params
    },
    responseType: 'blob'
  })
}

export function getReportsList(params) {
  return request({
    url: '/reports/',
    method: 'get',
    params
  })
}

export function getHostList(params) {
  return request({
    url: '/zabbixHostList/',
    method: 'get',
    params
  })
}

export function addReport(params) {
  return request({
    url: '/reports/',
    method: 'POST',
    data: params
  })
}
export function deleteReport(id) {
  return request({
    url: '/reports/' + id + '/',
    method: 'delete'
  })
}

