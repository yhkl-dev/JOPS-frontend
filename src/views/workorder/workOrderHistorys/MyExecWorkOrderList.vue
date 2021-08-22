<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="3">
          <el-select v-model="searchForm.template_order_model"
                     size="small"
                     placeholder="工单类型"
                     default-first-option>
            <el-option v-for="(item,value) in workOrderModelList"
                       :key="value"
                       :label="item.model_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker style="width: 100%;"
                          size="small"
                          v-model="dateValue"
                          type="datetimerange"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchForm.order_task_id"
                    size="small"
                    clearable
                    placeholder="工单编号"
                    @keyup.enter.native="handleFilter">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="handleFilter">
            </el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table :data="workOrderExecHistoryList"
              v-loading="execLoading"
              highlight-current-row>
      <el-table-column label="工单 ID"
                       prop="order_task_id"
                       align="center"
                       width="200px">
      </el-table-column>
      <el-table-column label="工单类型"
                       prop="order_model"
                       width="100px"
                       align="center">
      </el-table-column>
      <el-table-column label="申请人"
                       prop="created_user"
                       width="80px"
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
                       width="180px"
                       align="center">
        <template slot-scope="scope">
          <span v-for="item in scope.row.order_env_type">
            <el-tag > {{ item.name }}</el-tag>
            <span> </span>
          </span>

        </template>
      </el-table-column>
      <el-table-column label="最终执行"
                       prop="current_exec_user"
                       width="100px"
                       align="center">
      </el-table-column>
      <el-table-column label="最后更新时间"
                       prop="update_time"
                       align="center">
      </el-table-column>
      <el-table-column label="流转完成时间"
                       prop="complete_time"
                       width="150px"
                       align="center">
      </el-table-column>
      <el-table-column label="工单状态"
                       align="center">
        <template slot-scope="scope" >
          <el-tag>{{ scope.row.status_name }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="150px">
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
    <div class="pagination-container">
      <el-pagination background
                     @current-change="paginationChange"
                     :pager-count="5"
                     :page-size="searchForm.page_size"
                     layout="total, prev, pager, next, jumper"
                     :current-page.sync="searchForm.page"
                     :total="execTotalNum"
                     v-show="execTotalNum>=0">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="workOrderTaskDetailVisible"
               width="70%"
               center>
      <template slot="title">
        <span><h3>工 单 详 情</h3></span>
      </template>
      <work-order-history-exec-detail  v-bind:workOrderDetail="workOrderDetail">
      </work-order-history-exec-detail>
    </el-dialog>
  </div>

</template>

<script>
  import workOrderHistoryExecDetail from './workOrderHistoryExecDetail'
  export default {
    name: 'MyExecWorkOrderList',
    components: { workOrderHistoryExecDetail },
    props: ['workOrderExecHistoryList', 'execLoading', 'execTotalNum', 'workOrderModelList'],
    data() {
      return {
        workOrderTaskDetailVisible: false,
        workOrderDetail: {},
        searchForm: {
          order_task_id: '',
          order_title: '',
          template_order_model: '',
          create_time_before: '',
          create_time_after: '',
          page: 1,
          page_size: 5
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dateValue: ''
      }
    },
    methods: {
      checkWorkOrderTaskDetail(row) {
        this.workOrderTaskDetailVisible = true
        this.workOrderDetail = row
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.handleFilter()
      },
      handleFilter() {
        if (this.dateValue === null || this.dateValue === '' || this.dateValue.length === 0) {
          this.searchForm.create_time_before = ''
          this.searchForm.create_time_after = ''
        } else {
          this.searchForm.create_time_before = this.dateValue[1]
          this.searchForm.create_time_after = this.dateValue[0]
        }
        this.$emit('handleSearchExecTask', this.searchForm)
      }
    }
  }
</script>

<style scoped>

</style>
