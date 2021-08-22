import request from '@/utils/request'

// task
export function getWorkOrderTaskList(params) {
  return request({
    url: '/workOrderTask/',
    method: 'get',
    params
  })
}

export function updateWorkOrderTask(id, params) {
  return request({
    url: '/workOrderTask/' + id + '/',
    method: 'put',
    data: params
  })
}

export function addWorkOrderTaskList(data) {
  return request({
    url: '/workOrderTask/',
    method: 'post',
    data
  })
}

export function addWorkOrderOperation(data) {
  return request({
    url: '/workOrderOperation/',
    method: 'post',
    data
  })
}

export function getWorkOrderOperationCode(params) {
  return request({
    url: '/workOrderTaskOperationStatusCode/',
    method: 'get',
    params
  })
}

export function getWorkOrderTaskCode(params) {
  return request({
    url: '/workOrderTaskStatusCode/',
    method: 'get',
    params
  })
}

export function getTemplateWorkOrderModelList(params) {
  return request({
    url: '/templateWorkOrderModel/',
    method: 'get',
    params
  })
}

export function getTemplateWorkOrderModelById(id) {
  return request({
    url: '/templateWorkOrderModel/' + id + '/',
    method: 'get'
  })
}

export function addTemplateWorkOrderModelList(data) {
  return request({
    url: '/templateWorkOrderModel/',
    method: 'post',
    data
  })
}

export function addTemplateWorkOrderModelItem(data) {
  return request({
    url: '/templateWorkOrderModelItem/',
    method: 'post',
    data
  })
}

export function updateTemplateWorkOrderModelList(id, params) {
  return request({
    url: '/templateWorkOrderModel/' + id + '/',
    method: 'put',
    data: params
  })
}

export function updateTemplateWorkOrderType(id, params) {
  return request({
    url: '/templateWorkOrderType/' + id + '/',
    method: 'put',
    data: params
  })
}

export function getWorkOrderModelList(params) {
  return request({
    url: '/templateWorkOrderModel/',
    method: 'get',
    params
  })
}

export function getTemplateWorkOrderTypeById(id) {
  return request({
    url: '/templateWorkOrderType/' + id + '/',
    method: 'get'
  })
}

export function getTemplateWorkOrderType(params) {
  return request({
    url: '/templateWorkOrderType/',
    method: 'get',
    params
  })
}

export function getTemplateWorkOrderFlowType(params) {
  return request({
    url: '/templateWorkOrderFlowType/',
    method: 'get',
    params
  })
}

export function addTemplateWorkOrderFlowType(data) {
  return request({
    url: '/templateWorkOrderFlowType/',
    method: 'post',
    data
  })
}

export function updateTemplateWorkOrderFlowType(id, params) {
  return request({
    url: '/templateWorkOrderFlowType/' + id + '/',
    method: 'put',
    data: params
  })
}

export function getTemplateWorkOrderTaskFlow(params) {
  return request({
    url: '/templateWorkOrderTaskFlow/',
    method: 'get',
    params
  })
}

export function addTemplateWorkOrderTaskFlow(data) {
  return request({
    url: '/templateWorkOrderTaskFlow/',
    method: 'post',
    data
  })
}

export function updateTemplateWorkOrderTaskFlow(id, params) {
  return request({
    url: '/templateWorkOrderTaskFlow/' + id + '/',
    method: 'put',
    data: params
  })
}

export function addTemplateWorkOrderType(data) {
  return request({
    url: '/templateWorkOrderType/',
    method: 'post',
    data
  })
}

export function addTemplateWorkOrderTaskFlowItem(data) {
  return request({
    url: '/templateWorkOrderTaskFlowItem/',
    method: 'post',
    data
  })
}

export function updateTemplateWorkOrderTaskFlowItem(id, params) {
  return request({
    url: '/templateWorkOrderTaskFlowItem/' + id + '/',
    method: 'put',
    data: params
  })
}

export function deleteTemplateWorkOrderTaskFlowItem(id) {
  return request({
    url: '/templateWorkOrderTaskFlowItem/' + id + '/',
    method: 'delete'
  })
}

/* 待执行工单 */
export function getExecWorkOrderTaskList(params) {
  return request({
    url: '/execWorkOrderTaskList/',
    method: 'get',
    params
  })
}

/* 待审核工单 */
export function getAuditWorkOrderTaskList(params) {
  return request({
    url: '/auditWorkOrderTaskList/',
    method: 'get',
    params
  })
}

/* 工单历史*/
export function getworkOrderTaskHistory(params) {
  return request({
    url: '/workOrderTaskHistory/',
    method: 'get',
    params
  })
}

/* 工单历史*/
export function getWorkOrderTaskExecHistory(params) {
  return request({
    url: '/workOrderTaskExecHistory/',
    method: 'get',
    params
  })
}

/* 工单历史*/
export function getWorkOrderTaskAuditHistory(params) {
  return request({
    url: '/workOrderTaskAuditHistory/',
    method: 'get',
    params
  })
}

/* 工单历史统计*/
export function getWorkOrderHistoryCount(params) {
  return request({
    url: '/workOrderHistoryCount/',
    method: 'get',
    params
  })
}

export function getWorkOrderHistCountCheckByProduct(params) {
  return request({
    url: '/workOrderHistCountCheckByProduct/',
    method: 'get',
    params
  })
}

export function getLineChartData(params) {
  return request({
    url: '/lineChartData/',
    method: 'get',
    params
  })
}

export function getLineChart(params) {
  return request({
    url: '/lineChart/',
    method: 'get',
    params
  })
}
