<template>
    <div class="app-container">
      <el-row :gutter="24">
        <el-col :span="6">
          <work-order-model-manager v-bind:workOrderModelList="workOrderModelList"
                                    v-bind:templateWorkOrderTypeList="templateWorkOrderTypeList"
                                    v-bind:workOrderModelListTotalNum="workOrderModelListTotalNum"
                                    v-bind:templateWorkOrderFlowTypeList="templateWorkOrderFlowTypeList"
                                    @fresh="refreshWorkOrderModelList">
          </work-order-model-manager>
        </el-col>
        <el-col :span="6">
          <work-order-type-manager v-bind:templateWorkOrderTypeList="templateWorkOrderTypeList"
                                   v-bind:templateWorkOrderTypeListTotalNum="templateWorkOrderTypeListTotalNum"
                                   @fresh="refreshTemplateWorkOrderType">
          </work-order-type-manager>
        </el-col>
        <el-col :span="6">
          <work-order-flow-type-manager v-bind:templateWorkOrderFlowTypeList="templateWorkOrderFlowTypeList"
                                        v-bind:templateWorkOrderFlowList="templateWorkOrderFlowList"
                                        v-bind:templateWorkOrderFlowListTotalNum="templateWorkOrderFlowListTotalNum"
                                        @fresh="refreshWorkOrderFlowType">
          </work-order-flow-type-manager>
        </el-col>
        <el-col :span="6">
          <work-order-flow-manager v-bind:templateWorkOrderFlowList="templateWorkOrderFlowList"
                                   v-bind:templateWorkOrderFlowListTotalNum="templateWorkOrderFlowTypeListTotalNum"
                                   v-bind:userList="userList"
                                   @fresh="refreshWorkOrderFLowItem">
          </work-order-flow-manager>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import { getWorkOrderModelList,
    getTemplateWorkOrderType,
    getTemplateWorkOrderFlowType,
    getTemplateWorkOrderTaskFlow } from '@/api/workorder'
  import { getUserList } from '@/api/users'
  import workOrderModelManager from './workOrderModel/workOrderModelManager'
  import workOrderTypeManager from './workOrderModel/workOrderTypeManager'
  import workOrderFlowTypeManager from './workOrderModel/workOrderFlowTypeManager'
  import workOrderFlowManager from './workOrderModel/workOrderFlowManager'
  // import { validAlphabets } from '../../utils/validate'

  export default {
    name: 'WorkOrderModelManagement',
    components: { workOrderModelManager, workOrderFlowManager, workOrderTypeManager, workOrderFlowTypeManager },
    data() {
      return {
        loading: false,
        workOrderModelTypeFormVisible: false,
        workOrderFlowTypeFormVisible: false,
        // templateWorkOrderFlowListTotaLoading: false,
        filterText: '',
        workOrderModelList: [],
        workOrderModelListTotalNum: 0,
        templateWorkOrderTypeList: [],
        templateWorkOrderTypeListTotalNum: 0,
        templateWorkOrderFlowTypeList: [],
        templateWorkOrderFlowTypeListTotalNum: 0,
        templateWorkOrderFlowList: [],
        templateWorkOrderFlowListTotalNum: 0,
        userList: [],
        workOrderModelDetail: {},
        workOrderModelTypeForm: {
          id: '',
          type_name: '',
          type_status: ''
        },
        workOrderFlowTypeForm: {
          id: '',
          flow_type_name: '',
          flow_type_status: '',
          task_audit_flow: '',
          task_audit_flow_name: '',
          task_exec_flow_name: '',
          task_exec_flow: ''
        },
        statusCode: [
          { id: 1, name: '启用' },
          { id: 0, name: '禁用' }
        ],
        params: {}
      }
    },
    methods: {
      fetchData(params) {
        getUserList(params).then(
          res => {
            this.userList = res.results
          }
        )
      },
      getWorkOrderModelListData(params) {
        this.loading = true
        getWorkOrderModelList(params).then(
          res => {
            this.workOrderModelList = res.results
            this.workOrderModelListTotalNum = res.count
            this.loading = false
          }
        )
      },
      getTemplateWorkOrderTypeData(params) {
        getTemplateWorkOrderType(params).then(
          res => {
            console.log(params)
            this.templateWorkOrderTypeList = res.results
            this.templateWorkOrderTypeListTotalNum = res.count
          }
        )
      },
      getTemplateWorkOrderTaskFlowData(params) {
        getTemplateWorkOrderTaskFlow(params).then(
          res => {
            this.templateWorkOrderFlowList = res.results
            this.templateWorkOrderFlowTypeListTotalNum = res.count
          }
        )
      },
      getTemplateWorkOrderFlowTypeData(params) {
        getTemplateWorkOrderFlowType(params).then(
          res => {
            this.templateWorkOrderFlowTypeList = res.results
            this.templateWorkOrderFlowListTotalNum = res.count
            this.loading = false
          }
        )
      },
      refreshWorkOrderFLowItem(data) {
        this.getTemplateWorkOrderTaskFlowData(data)
      },
      refreshWorkOrderFlowType(data) {
        this.getTemplateWorkOrderFlowTypeData(data)
      },
      refreshWorkOrderModelList(data) {
        console.log('data')
        this.getWorkOrderModelListData(data)
      },
      refreshTemplateWorkOrderType(data) {
        console.log('refreshTemplateWorkOrderType', data)
        this.getTemplateWorkOrderTypeData(data)
      },
      fresh() {
        this.fetchData()
        this.getTemplateWorkOrderTaskFlowData()
        this.getTemplateWorkOrderFlowTypeData()
        this.getTemplateWorkOrderTypeData()
        this.getWorkOrderModelListData()
      }
    },
    created() {
      this.fetchData()
      this.getTemplateWorkOrderTaskFlowData({ page: 1, page_size: 8 })
      this.getTemplateWorkOrderFlowTypeData({ page: 1, page_size: 8 })
      this.getTemplateWorkOrderTypeData({ page: 1, page_size: 8 })
      this.getWorkOrderModelListData({ page: 1, page_size: 8 })
    }
  }
</script>

<style scoped>

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

</style>
