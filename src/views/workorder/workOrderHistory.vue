<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>申请历史</span>
      </div>
      <my-work-order-history-list v-bind:workOrderHistoryList="workOrderHistoryList"
                                  v-bind:totalNum="totalNum"
                                  v-bind:workOrderModelList="workOrderModelList"
                                  @handleSearchTask="handleSearchTask"
                                  v-bind:loading="loading">
      </my-work-order-history-list>
    </el-card>
    <el-card>
      <div slot="header">
        <span>审核历史</span>
      </div>
      <my-audit-work-order-list v-bind:workOrderAuditHistoryList="workOrderAuditHistoryList"
                                v-bind:auditTotalNum="auditTotalNum"
                                v-bind:workOrderModelList="workOrderModelList"
                                @handleSearchAuditTask="handleSearchAuditTask"
                                v-bind:auditLoading="auditLoading">
      </my-audit-work-order-list>
    </el-card>
    <el-card>
      <div slot="header">
        <span>执行历史</span>
      </div>
      <my-exec-work-order-list v-bind:workOrderExecHistoryList="workOrderExecHistoryList"
                               v-bind:execTotalNum="execTotalNum"
                               v-bind:workOrderModelList="workOrderModelList"
                               @handleSearchExecTask="handleSearchExecTask"
                               v-bind:execLoading="execLoading">
      </my-exec-work-order-list>
    </el-card>
  </div>

</template>

<script>
  import { getworkOrderTaskHistory, getWorkOrderTaskExecHistory,
    getTemplateWorkOrderModelList,
    getWorkOrderTaskAuditHistory } from '@/api/workorder'
  import MyWorkOrderHistoryList from './workOrderHistorys/MyWorkOrderHistoryList'
  import MyExecWorkOrderList from './workOrderHistorys/MyExecWorkOrderList'
  import MyAuditWorkOrderList from './workOrderHistorys/MyAuditWorkOrderList'

  export default {
    name: 'workOrderHistory',
    components: { MyWorkOrderHistoryList, MyExecWorkOrderList, MyAuditWorkOrderList },
    data() {
      return {
        loading: false,
        execLoading: false,
        auditLoading: false,
        workOrderHistoryList: [],
        workOrderExecHistoryList: [],
        workOrderAuditHistoryList: [],
        workOrderModelList: [],
        searchForm: {
          page: 1,
          page_size: 5
        },
        totalNum: 0,
        execTotalNum: 0,
        auditTotalNum: 0
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getworkOrderTaskHistory(this.searchForm).then(
          res => {
            this.workOrderHistoryList = res.results
            this.totalNum = res.count
            this.loading = false
          }
        )
        getTemplateWorkOrderModelList().then(
          res => {
            this.workOrderModelList = res.results
          }
        )
      },
      getWorkOrderTaskExecHistorys() {
        this.execLoading = true
        getWorkOrderTaskExecHistory(this.searchForm).then(
          res => {
            this.workOrderExecHistoryList = res.results
            this.execTotalNum = res.count
            this.execLoading = false
          }
        )
      },
      getWorkOrderTaskAuditHistorys() {
        this.auditLoading = true
        getWorkOrderTaskAuditHistory(this.searchForm).then(
          res => {
            this.workOrderAuditHistoryList = res.results
            this.auditTotalNum = res.count
            this.auditLoading = false
          }
        )
      },
      handleSearchTask(searchData) {
        this.searchForm = searchData
        this.fetchData()
      },
      handleSearchExecTask(searchData) {
        this.searchForm = searchData
        this.getWorkOrderTaskExecHistorys()
      },
      handleSearchAuditTask(searchData) {
        this.searchForm = searchData
        this.getWorkOrderTaskAuditHistorys()
      }
    },
    created() {
      this.fetchData()
      this.getWorkOrderTaskExecHistorys()
      this.getWorkOrderTaskAuditHistorys()
    }
  }
</script>

<style scoped>
.el-card {
  margin-bottom: 10px;
}
</style>
