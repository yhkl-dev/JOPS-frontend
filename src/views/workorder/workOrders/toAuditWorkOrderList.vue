<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin-bottom: 10px; margin-top: 20px; position: relative;">
      <el-row :gutter="24">
        <el-col :span="18" >
          <el-button type="primary"
                     size="small"
                     icon="el-icon-refresh"
                     @click="handleRefresh">刷 新</el-button>
        </el-col>
        <el-col :span="6">
          <el-pagination background
                         @current-change="paginationChange"
                         :pager-count="5"
                         :page-size="searchForm.page_size"
                         layout="total, prev, pager, next, jumper"
                         :current-page.sync="searchForm.page"
                         :total="auditTaskTotalNum"
                         v-show="auditTaskTotalNum>0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-table :data="auditWorkOrderTaskList"
              v-loading="auditListLoading"
              highlight-current-row
              border>
      <el-table-column label="工单 ID"
                       prop="order_task_id"
                       align="center"
                       width="180px">
      </el-table-column>
      <el-table-column label="工单标题"
                       prop="order_title"
                       align="center">
      </el-table-column>
      <el-table-column label="工单类型"
                       width="100px"
                       prop="order_model"
                       align="center">
      </el-table-column>
      <el-table-column label="产品线"
                       prop="order_product_name"
                       align="center">
      </el-table-column>
      <el-table-column label="项目名称"
                       prop="order_project_name"
                       align="center">
      </el-table-column>
      <el-table-column label="平台"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span v-for="item in scope.row.order_env_type">
            <el-tag size="mini"> {{ item.name }}</el-tag>
            <span> </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="当前审核"
                       prop="current_audit_user"
                       width="80px"
                       align="center">
      </el-table-column>
      <el-table-column label="最近更新"
                       width="160px"
                       prop="update_time"
                       align="center">
      </el-table-column>
      <el-table-column label="工单状态"
                       width="150px"
                       align="center">
        <template slot-scope="scope" >
          <el-tag>{{ scope.row.status_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="50px">
        <template slot-scope="scope">
          <el-button type="primary"
                     plain
                     size="mini"
                     icon="el-icon-document" circle
                     @click="checkWorkOrderTaskDetail(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="workOrderTaskDetailVisible"
               width="70%"
               center
               @closed="restOrderField">
      <template slot="title">
        <span><h3>工 单 详 情</h3></span>
      </template>
      <to-audit-work-order-detail v-bind:workOrderDetail="workOrderDetail"
                                  @replyWorkOrderTaskForm="replyWorkOrderTaskForm"
                                  @handleWorkOrderOperation="handleWorkOrderOperation">
      </to-audit-work-order-detail>
    </el-dialog>
  </div>

</template>

<script>
  import { addWorkOrderOperation } from '@/api/workorder'
  import toAuditWorkOrderDetail from './toAuditWorkOrderDetail'

  export default {
    name: 'toAuditWorkOrderList',
    props: ['auditWorkOrderTaskList', 'auditListLoading', 'auditTaskTotalNum'],
    components: { toAuditWorkOrderDetail },
    data() {
      return {
        workOrderTaskDetailVisible: false,
        workOrderDetail: {},
        searchForm: {
          page: 1,
          page_size: 5
        }
      }
    },
    methods: {
      handleRefresh() {
        this.$emit('auditListRefresh', this.searchForm)
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.handleRefresh()
      },
      checkWorkOrderTaskDetail(row) {
        this.workOrderTaskDetailVisible = true
        this.workOrderDetail = row
      },
      restOrderField() {
        this.workOrderTaskDetailVisible = false
        this.$refs[this.workOrderDetail].resetFields()
      },
      replyWorkOrderTaskForm(data) {
        addWorkOrderOperation(data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.$emit('auditListRefresh')
        })
      },
      handleWorkOrderOperation(data) {
        addWorkOrderOperation(data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.$emit('auditListRefresh')
        })
      }
    }
  }
</script>

<style scoped>

</style>
