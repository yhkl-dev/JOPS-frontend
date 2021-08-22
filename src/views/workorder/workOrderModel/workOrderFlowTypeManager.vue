<template>
  <div class="app-container">
    <el-card >
      <div slot="header" style="text-align: center">
        <span>流程类型</span>
        <el-button style="float: right; padding: 3px 0"
                   size="mini"
                   type="text"
                   icon="el-icon-plus"
                   @click="handleAddFlowType">添加</el-button>
      </div>
      <el-table :show-header="false" :data="templateWorkOrderFlowTypeList"  @row-dblclick="handleEditFlowType">
        <el-table-column label="" width="40px">
          <template slot-scope="scope">
            <el-tooltip >
              <div slot="content">
                执行流程: {{ scope.row.task_exec_flow_name }} <br/><br/>
                审核流程: {{ scope.row.task_audit_flow_name }}<br/><br/>
                创建时间: {{ scope.row.create_time }}<br/><br/>
                更新时间: {{ scope.row.change_time }}
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  label="流程名称" >
          <template slot-scope="scope">
            <el-tooltip content="双击编辑">
              <div slot>{{ scope.row.flow_type_name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         prop="flow_type_status"
                         align="right">
          <template slot-scope="scope">
            <el-switch active-color="#409EFF"
                       v-model="scope.row.flow_type_status"
                       :active-value="1"
                       :inactive-value="0"
                       @change="statusChange(scope.row)" ></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 5px ">
        <el-pagination @current-change="paginationChange"
                       :pager-count="5"
                       :page-size="searchForm.page_size"
                       layout="prev, pager, next"
                       :current-page.sync="searchForm.page"
                       :total="templateWorkOrderFlowListTotalNum"
                       v-show="templateWorkOrderFlowListTotalNum>0">
        </el-pagination>
      </div>
      <el-dialog title="编辑流程类型"  :visible.sync="updateFlowTypeVisible" width="20%" center>
        <el-form ref="changeFlowTypeForm" :model="changeFlowTypeForm" label-width="80px">
          <el-form-item prop="flow_type_name" label="类型名称">
            <el-input size="small" v-model="changeFlowTypeForm.flow_type_name"  placeholder="请输入类型名称"></el-input>
          </el-form-item>
          <el-form-item label="审核流程" prop="task_audit_flow" >
            <el-select v-model="changeFlowTypeForm.task_audit_flow" placeholder="审核流程"  size="small" style="width: 100%">
              <el-option v-for="(item, index) in templateWorkOrderFlowList"
                         :key="index"
                         :label="item.flow_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="执行流程"  prop="task_exec_flow">
            <el-select v-model="changeFlowTypeForm.task_exec_flow" placeholder="执行流程"  size="small" style="width: 100%">
              <el-option v-for="(item, index) in templateWorkOrderFlowList"
                         :key="index"
                         :label="item.flow_name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: 5px">
            <el-button type="primary" size="small" @click="handleSubmitFlowType">确 定</el-button>
            <el-button  size="small" @click="updateFlowTypeVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
      <el-dialog title="创建流程类型"  :visible.sync="addFlowTypeVisible" width="20%" center>
        <el-form ref="addFlowTypeForm" :model="addFlowTypeForm" label-width="80px">
          <el-form-item prop="flow_type_name" label="模板名称">
            <el-input size="small" v-model="addFlowTypeForm.flow_type_name" placeholder="模板名称"></el-input>
          </el-form-item>
          <el-form-item prop="task_exec_flow" label="执行流程">
            <el-select v-model="addFlowTypeForm.task_exec_flow" placeholder="执行流程"  size="small" style="width: 100%">
              <el-option v-for="(item, index) in templateWorkOrderFlowList"
                         :key="index"
                         :label="item.flow_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="task_audit_flow" label="审核流程">
            <el-select v-model="addFlowTypeForm.task_audit_flow" placeholder="审核流程"  size="small" style="width: 100%">
              <el-option v-for="(item, index) in templateWorkOrderFlowList"
                         :key="index"
                         :label="item.flow_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: 5px">
            <el-button type="primary" size="small" @click="handleSubmitAddFlowType">确 定</el-button>
            <el-button size="small" @click="addFlowTypeVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { updateTemplateWorkOrderFlowType, addTemplateWorkOrderFlowType } from '@/api/workorder'

  export default {
    name: 'workOrderFlowTypeManager',
    props: ['templateWorkOrderFlowTypeList', 'templateWorkOrderFlowList', 'templateWorkOrderFlowListTotalNum'],
    data() {
      return {
        addFlowTypeVisible: false,
        updateFlowTypeVisible: false,
        changeFlowTypeForm: {
          flow_type_name: '',
          flow_type_status: '',
          task_exec_flow: '',
          task_audit_flow: ''
        },
        addFlowTypeForm: {
          flow_type_name: '',
          flow_type_status: 1,
          task_exec_flow: '',
          task_audit_flow: ''
        },
        searchForm: {
          page: 1,
          page_size: 8
        }
      }
    },
    methods: {
      statusChange(row) {
        console.log('change status')
        updateTemplateWorkOrderFlowType(row.id, row).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('fresh', this.searchForm)
        })
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.$emit('fresh', this.searchForm)
      },
      handleAddFlowType() {
        this.addFlowTypeVisible = true
      },
      handleSubmitAddFlowType() {
        this.$refs['addFlowTypeForm'].validate((valid) => {
          if (!valid) {
            return
          }
          addTemplateWorkOrderFlowType(this.addFlowTypeForm).then(() => {
            this.addFlowTypeVisible = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$refs['addFlowTypeForm'].resetFields()
            this.$emit('fresh', this.searchForm)
          })
        })
      },
      handleEditFlowType(row) {
        this.updateFlowTypeVisible = true
        const { id, flow_type_name, flow_type_status, task_exec_flow, task_audit_flow } = row
        this.changeFlowTypeForm = { id, flow_type_name, flow_type_status, task_exec_flow, task_audit_flow }
      },
      handleSubmitFlowType() {
        this.$refs['changeFlowTypeForm'].validate((valid) => {
          if (!valid) {
            return
          }
          updateTemplateWorkOrderFlowType(this.changeFlowTypeForm.id, this.changeFlowTypeForm).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.updateFlowTypeVisible = false
            this.$emit('fresh', this.searchForm)
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
