<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="我的工单">
        <my-work-order-list v-bind:workOrderTaskList="workOrderTaskList"
                            v-bind:workOrderModelList="workOrderModelList"
                            v-bind:taskTotalNum="taskTotalNum"
                            v-bind:productList="productList"
                            v-bind:projectList="projectList"
                            v-bind:loading="loading"
                            @handleSearchTask="handleSearchTask"
                            @refresh="refresh"
                            @handleCommitAddWorkOrderTask="handleCommitAddWorkOrderTask"></my-work-order-list>
      </el-tab-pane>
    </el-tabs>
    <el-tabs type="border-card">
      <el-tab-pane label="待审核工单">
        <to-audit-work-order-list v-bind:auditWorkOrderTaskList="auditWorkOrderTaskList"
                                  v-bind:auditListLoading="auditListLoading"
                                  v-bind:auditTaskTotalNum="auditTaskTotalNum"
                                  @auditListRefresh="auditListRefresh">
        </to-audit-work-order-list>
      </el-tab-pane>
    </el-tabs>
    <el-tabs type="border-card">
      <el-tab-pane label="待执行工单">
        <to-do-work-order-list v-bind:execWorkOrderTaskList="execWorkOrderTaskList"
                               v-bind:taskToDoTotalNum="taskToDoTotalNum"
                               v-bind:toDoListLoading="toDoListLoading"
                               @refreshToDoList="refreshToDoList">
        </to-do-work-order-list>
      </el-tab-pane>
    </el-tabs>

  </div>

</template>

<script>
  import { getWorkOrderTaskList,
    addWorkOrderTaskList,
    getWorkOrderOperationCode,
    getWorkOrderTaskCode,
    getTemplateWorkOrderModelList,
    getExecWorkOrderTaskList,
    getAuditWorkOrderTaskList } from '@/api/workorder'
  import { getProductList } from '@/api/resource'
  import { getProjectList } from '@/api/project'
  import MyWorkOrderList from './workOrders/myWorkOrderList'
  import toDoWorkOrderList from './workOrders/toDoWorkOrderList'
  import toAuditWorkOrderList from './workOrders/toAuditWorkOrderList'

  export default {
    name: 'workOrderTask',
    components: { MyWorkOrderList, toDoWorkOrderList, toAuditWorkOrderList },
    data() {
      return {
        activeName: '1',
        workOrderTaskList: [],
        workOrderTaskCode: [],
        workOrderOperationCode: [],
        workOrderModelList: [],
        execWorkOrderTaskList: [],
        auditWorkOrderTaskList: [],
        productList: [],
        projectList: [],
        taskTotalNum: 0,
        taskToDoTotalNum: 0,
        auditTaskTotalNum: 0,
        workOrderTaskDetailVisible: false,
        workOrderTaskVisible: false,
        loading: false,
        toDoListLoading: false,
        auditListLoading: false,
        searchForm: {
          page: 1,
          page_size: 5
        }
      }
    },
    methods: {
      fetchData(params) {
        this.loading = true
        getWorkOrderTaskList(this.searchForm).then(
          res => {
            this.workOrderTaskList = res.results
            this.taskTotalNum = res.count
            this.loading = false
          }
        )
        getWorkOrderTaskCode(params).then(
          res => {
            this.workOrderTaskCode = res.code
          }
        )
        getWorkOrderOperationCode(params).then(
          res => {
            this.workOrderOperationCode = res.code
          }
        )
        getTemplateWorkOrderModelList({ page: 1, page_size: 100 }).then(
          res => {
            this.workOrderModelList = res.results
          }
        )
        getProductList().then(
          res => {
            this.productList = res
          }
        )
        getProjectList().then(
          res => {
            this.projectList = res.results
          }
        )
      },
      fetchToDoData(data) {
        this.toDoListLoading = true
        if (data === undefined) {
          getExecWorkOrderTaskList({ page: 1, page_size: 5 }).then(
            res => {
              this.execWorkOrderTaskList = res.results
              this.taskToDoTotalNum = res.count
              this.toDoListLoading = false
            }
          )
        } else {
          getExecWorkOrderTaskList(data).then(
            res => {
              this.execWorkOrderTaskList = res.results
              this.taskToDoTotalNum = res.count
              this.toDoListLoading = false
            }
          )
        }
      },
      fetchAuditData(data) {
        this.auditListLoading = true
        if (data === undefined) {
          getAuditWorkOrderTaskList({ page: 1, page_size: 5 }).then(
            res => {
              this.auditWorkOrderTaskList = res.results
              this.auditTaskTotalNum = res.count
              this.auditListLoading = false
            }
          )
        } else {
          getAuditWorkOrderTaskList(data).then(
            res => {
              this.auditWorkOrderTaskList = res.results
              this.auditTaskTotalNum = res.count
              this.auditListLoading = false
            }
          )
        }
      },
      handleSearchTask(searchData) {
        this.searchForm = searchData
        this.fetchData()
      },
      handleCommitAddWorkOrderTask(data) {
        addWorkOrderTaskList(data).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      },
      refresh() {
        this.fetchData()
      },
      refreshToDoList(data) {
        this.fetchToDoData(data)
      },
      auditListRefresh(data) {
        this.fetchAuditData(data)
      }
    },
    created() {
      this.fetchData()
      this.fetchToDoData()
      this.fetchAuditData()
    }
  }
</script>

<style scoped>
  /*.work_order_class {*/
  /*  overflow: scroll;*/
  /*}*/
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-tabs {
    margin-bottom: 10px;
  }
</style>
