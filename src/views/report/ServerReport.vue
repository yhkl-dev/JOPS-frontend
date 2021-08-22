<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="2.5">
          <el-select
            v-model="searchForms.report_type"
            placeholder="请选择"
            size="small">
            <el-option
              v-for="item in reportTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="3.5">
          <el-input
            v-model="searchForms.report_name"
            placeholder="报告名称"
            size="small"
            class="filter-item" >
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter">
            搜 索
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-button
            size="small"
            type="primary"
            @click="handleAddBtn">
            创建报告
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="reportList"
      v-loading="loading"
      element-loading-text="Loading...">
      <el-table-column
        prop="report_name"
        label="报告名"
        width="200px"
        align="center">
      </el-table-column>
      <el-table-column
        prop="report_type"
        label="报告类型"
        align="center"
        width="150px">
        <template slot-scope="{row}">
          <div v-if="row.report_type === 'SERVER_DAILY_REPORT'">运维日报</div>
          <div v-if="row.report_type === 'DB_DAILY_REPORT'">数据库日报</div>
          <div v-if="row.report_type === 'SERVER_REPORT'">临时报告</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="report_create_time"
        label="创建时间"
        width="180px"
        align="center"></el-table-column>
      <el-table-column
        prop="report_start_timestamp"
        label="报告截止时间"
        width="180px"
        align="center"></el-table-column>
      <el-table-column
        prop="report_period"
        label="报告周期(s)"
        align="center"
        width="160px">
        <template slot-scope="{row}">
            <div v-for="period in reportPeriod">
              <span v-if="row.report_period === period.value"> {{ period.name }}</span>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="report_hosts"
        label="主机列表"
        align="center"
        width="250px">
        <template slot-scope="{row}">
          <div v-if="row.report_hosts === ''">all servers</div>
          <div v-for="item in row.report_hosts.split(',')">
            <div v-for="hsotitem in hostList">
              <span v-if="item === hsotitem.hostid"> {{ hsotitem.host }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="report_file"  label="文件名称" align="center"></el-table-column>
      <el-table-column prop="" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain @click="downloadAttachment(scope.row)">下载</el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="pagination-container"
      v-show="totalNum<=10">
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :total="totalNum">
      </el-pagination>
    </div>
    <el-dialog
      title="添加报告"
      :visible.sync="dialogVisibleForAddReport"
      center
      width="40%">
      <el-form ref="addReportFile" :model="addReport" label-width="80px" >
        <el-form-item label="报告名称" prop="report_name">
          <el-input v-model="addReport.report_name"  placeholder="请输入报告名称" ></el-input>
        </el-form-item>
        <el-form-item label="报告类型" >
          <el-select v-model="addReport.report_type" placeholder="请选择报告类型" style="width:100%">
            <el-option
              v-for="item in addReportTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机">
          <el-select v-model="addReport.report_hosts" multiple  placeholder="请选择主机， 不填则默认全部主机" style="width:100%">
            <el-option
              v-for="item in hostList"
              :key="item.hostid"
              :label="item.name"
              :value="item.hostid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="报告开始时间"
          prop="report_start_timestamp" >
        <el-date-picker
          style="width: 100%"
          v-model="addReport.report_start_timestamp"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
        </el-form-item>
        <el-form-item
          label="报告周期"
          prop="report_period">
          <el-select
            v-model="addReport.report_period"
            filterable
            allow-create
            placeholder="请输入(单位：s)或选择报告周期" style="width:100%">
            <el-option
              v-for="item in reportPeriod"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="handleSubmitAdd">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="handleCancelAddReport">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getReportsList, getHostList, addReport, deleteReport } from '@/api/serverreport'

  export default {
    name: 'ServerReport',
    data() {
      return {
        reportList: [],
        hostList: [],
        items: '',
        dateValue: '',
        reportTypeList: [
          { 'value': 'ALL',
            'name': '全部'
          },
          { 'value': 'SERVER_DAILY_REPORT',
            'name': '运维日报'
          },
          { 'value': 'DB_DAILY_REPORT',
            'name': '数据库日报'
          },
          { 'value': 'SERVER_REPORT',
            'name': '临时报告'
          }
        ],
        addReportTypeList: [
          { 'value': 'SERVER_DAILY_REPORT',
            'name': '运维日报'
          },
          { 'value': 'DB_DAILY_REPORT',
            'name': '数据库日报'
          },
          { 'value': 'SERVER_REPORT',
            'name': '临时报告'
          }
        ],
        reportPeriod: [
          { 'value': 3600,
            'name': '1小时内'
          },
          { 'value': 21600,
            'name': '6小时内'
          },
          { 'value': 43200,
            'name': '12小时内'
          },
          { 'value': 86400,
            'name': '24小时内'
          },
          { 'value': 604800,
            'name': '一周内'
          }
        ],
        totalNum: 0,
        dialogVisibleForAddReport: false,
        addReport: {
          report_name: '',
          report_type: '',
          report_hosts: '',
          report_start_timestamp: '',
          report_period: ''
        },
        searchForms: {
          report_name: '',
          report_type: '',
          report_create_time_after: '',
          report_create_time_before: '',
          page: ''
        },
        params: {
          report_name: '',
          report_type: '',
          report_create_time_after: '',
          report_create_time_before: '',
          page: 1
        }
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getReportsList(this.params).then(
          res => {
            this.reportList = res.results
            this.totalNum = res.count
            this.loading = false
          }
        )
        getHostList(this.params).then(
          res => {
            this.hostList = res
          }
        )
      },
      downloadAttachment(row) {
        window.location.href = row.download_url
      },
      handleCurrentChange(val) {
        this.params.page = val
        this.fetchData()
      },
      handleAddBtn() {
        this.dialogVisibleForAddReport = true
      },
      handleCancelAddReport() {
        this.dialogVisibleForAddReport = false
        // this.addReport
        this.addReport = ''
      },
      handleFilter() {
        if (this.dateValue === null || this.dateValue === '' || this.dateValue.length === 0) {
          this.searchForms.report_create_time_before = ''
          this.searchForms.report_create_time_after = ''
        } else {
          this.searchForms.report_create_time_before = this.dateValue[1]
          this.searchForms.report_create_time_after = this.dateValue[0]
        }
        this.searchForms.page = 1
        // delete this.searchForms.dateValue
        this.params = this.searchForms
        // delete this.params.dateValue
        this.fetchData(this.params)
      },
      handleDelete(row) {
        this.$confirm('是否删除 ' + row.report_name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteReport(row.id).then(() => {
            this.$message({
              message: '删除策略成功',
              type: 'success'
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      },
      handleSubmitAdd() {
        // this.addReport.report_hosts = this.addReport.report_hosts.join(',')
        const report_list = this.addReport.report_hosts.join(',')
        if (this.addReport.report_hosts === '') {
          this.addReport.report_hosts = ''
        } else {
          this.addReport.report_hosts = report_list
        }

        addReport(this.addReport).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.handleCancelAddReport()
          this.fetchData()
        })
      }

    },
    created() {
      this.fetchData()
    }
  }
</script>

<style lang="scss" scoped>

  .text-center {
    margin-top: 15px;
    text-align: center;
  }
  .filter-container {
    margin-bottom: 10px;
  }
</style>
