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
                         :total="taskToDoTotalNum"
                         v-show="taskToDoTotalNum>0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-table :data="execWorkOrderTaskList"
              v-loading="toDoListLoading"
              highlight-current-row
              border>
      <el-table-column label="工单id"
                       prop="order_task_id"
                       align="center"
                       width="180px">
      </el-table-column>
      <el-table-column label="工单标题"
                       prop="order_title"
                       align="center">
      </el-table-column>
      <el-table-column label="工单类型"
                       prop="order_model"
                       width="100px"
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
          <!--          {{ scope.row.order_env_type }}-->
          <span v-for="item in scope.row.order_env_type">
            <el-tag size="mini"> {{ item.name }}</el-tag>
            <span> </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="当前执行"
                       prop="current_exec_user"
                       width="80px"
                       align="center">
      </el-table-column>
      <el-table-column label="最近更新"
                       prop="update_time"
                       width="160px"
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
               center>
      <template slot="title">
        <span><h3>工 单 详 情</h3></span>
      </template>
      <to-do-work-order-detail  v-bind:workOrderDetail="workOrderDetail"
                          @replyWorkOrderTaskForm="replyWorkOrderTaskForm"
                          @handleWorkOrderOperation="handleWorkOrderOperation">
      </to-do-work-order-detail>
    </el-dialog>
  </div>
</template>

<script>
  import { addWorkOrderOperation } from '@/api/workorder'
  import toDoWorkOrderDetail from './toDoWorkOrderDetail'

  export default {
    name: 'toDoWorkOrderList',
    props: ['execWorkOrderTaskList', 'toDoListLoading', 'taskToDoTotalNum'],
    components: { toDoWorkOrderDetail },
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
        this.$emit('refreshToDoList', this.searchForm)
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.handleRefresh()
      },
      restOrderField() {
        this.workOrderTaskDetailVisible = false
        this.$refs[this.workOrderDetail].resetFields()
      },
      checkWorkOrderTaskDetail(row) {
        this.workOrderTaskDetailVisible = true
        this.workOrderDetail = row
      },
      replyWorkOrderTaskForm(data) {
        addWorkOrderOperation(data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.fetchData()
        })
      },
      handleWorkOrderOperation(data) {
        addWorkOrderOperation(data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.$emit('refreshToDoList')
        })
      }
    }
  }
</script>

<style scoped>

</style>
