<template>
  <div class="app-container">
  <el-card >
    <div slot="header" style="text-align: center">
      <span>工单模板</span>
      <el-button style="float: right; padding: 3px 0" size="mini" type="text"  icon="el-icon-plus" @click="handleAddOrderModel">添加</el-button>
    </div>
    <el-table  :show-header="false" :data="workOrderModelList" @row-dblclick="handleEditWorkOrderModel" >
      <el-table-column label="" width="40px">
        <template slot-scope="scope">
          <el-tooltip >
            <div slot="content">
              模板类型: {{ scope.row.order_flow_type_name }} <br/><br/>
              模板流程: {{ scope.row.order_type_name }}<br/><br/>
              创建时间: {{ scope.row.model_create_time }}
            </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="工单模板" align="center">
        <template slot-scope="scope">
          <el-tooltip content="双击编辑">
            <div slot>{{ scope.row.model_name }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态"
                       prop="mode_status"
                       align="right">
        <template slot-scope="scope">
          <el-switch active-color="#409EFF"
                     v-model="scope.row.mode_status"
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
                     :total="workOrderModelListTotalNum"
                     v-show="workOrderModelListTotalNum>1">
      </el-pagination>
    </div>
    <el-dialog title="编辑模板"  :visible.sync="updateDialogVisible" width="30%" center>
      <el-form ref="changeModelForm" :model="changeModelForm" label-width="80px">
        <el-form-item prop="model_create_time" label="创建时间">
          <el-input size="small" v-model="changeModelForm.model_create_time" :disabled="true" placeholder="创建时间"></el-input>
        </el-form-item>
        <el-form-item prop="model_name" label="模板名称">
          <el-input size="small" v-model="changeModelForm.model_name" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="order_type" >
          <el-select v-model="changeModelForm.order_type" placeholder="模板类型"  size="small" style="width: 100%">
            <el-option v-for="(item, index) in templateWorkOrderTypeList"
                       :key="index"
                       :label="item.type_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="order_flow_type" label="模板流程">
          <el-select v-model="changeModelForm.order_flow_type" placeholder="模板类型"  size="small" style="width: 100%">
            <el-option v-for="(item, index) in templateWorkOrderFlowTypeList"
                       :key="index"
                       :label="item.flow_type_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(extra_fields, index) in changeModelForm.extra_fields"
                      :label="'字段' + index"
                      :key="extra_fields.key">
          <el-input v-model="extra_fields.value_name" size="small" placeholder="字段名称" style="width: 80%"> </el-input>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="small"
                     circle
                     @click.prevent="removeExtraFieldsOnUpdate(extra_fields)"></el-button>
        </el-form-item>
        <el-form-item style="margin-top: 5px">
          <el-button type="primary" size="small" @click="addExtraFieldsOnUpdate">新增字段</el-button>
          <el-button type="primary" size="small" @click="handleSubmitWorkOrderModel">确 定</el-button>
          <el-button  size="small" @click="updateDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog title="创建模板"  :visible.sync="addDialogVisible" width="30%" center>
      <el-form ref="addModelForm" :model="addModelForm" label-width="80px">
        <el-form-item prop="model_name" label="模板名称">
          <el-input size="small" v-model="addModelForm.model_name" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="order_type" >
          <el-select v-model="addModelForm.order_type" placeholder="模板类型"  size="small" style="width: 100%">
            <el-option v-for="(item, index) in templateWorkOrderTypeList"
                       :key="index"
                       :label="item.type_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="order_flow_type" label="模板流程">
          <el-select v-model="addModelForm.order_flow_type" placeholder="模板类型"  size="small" style="width: 100%">
            <el-option v-for="(item, index) in templateWorkOrderFlowTypeList"
                       :key="index"
                       :label="item.flow_type_name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-for="(extra_fields, index) in addModelForm.extra_fields"
                       :label="'附加字段' + index"
                       :key="extra_fields.key"
                       >
          <el-input v-model="extra_fields.value_name" size="small" style="width: 80%" placeholder="字段名称"></el-input>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="small"
                     circle
                     @click.prevent="removeExtraFields(extra_fields)"></el-button>
        </el-form-item>
        <el-form-item style="margin-top: 5px">
          <el-button type="primary" size="small" @click="addExtraFields">新增字段</el-button>
          <el-button type="primary" size="small" @click="handleSubmitAddWorkOrderModel">确 定</el-button>
          <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
  </div>
</template>

<script>
  import { updateTemplateWorkOrderModelList, addTemplateWorkOrderModelList } from '@/api/workorder'

  export default {
    name: 'workOrderModelManager',
    props: ['workOrderModelList', 'templateWorkOrderTypeList', 'templateWorkOrderFlowTypeList', 'workOrderModelListTotalNum'],
    data() {
      return {
        updateDialogVisible: false,
        addDialogVisible: false,
        changeModelForm: {
          id: '',
          model_create_time: '',
          model_name: '',
          mode_status: '',
          order_type: '',
          order_flow_type: '',
          extra_fields: [{
            value_name: ''
          }]
        },
        addModelForm: {
          model_name: '',
          mode_status: 1,
          order_type: '',
          order_flow_type: '',
          extra_fields: [{
            value_name: ''
            // value_type: ''
          }]
        },
        searchForm: {
          page: 1,
          page_size: 8
        }
      }
    },
    methods: {
      addExtraFields() {
        this.addModelForm.extra_fields.push({
          value_name: ''
        })
      },
      removeExtraFields(item) {
        const index = this.addModelForm.extra_fields.indexOf(item)
        if (index !== -1) {
          this.addModelForm.extra_fields.splice(index, 1)
        }
      },
      addExtraFieldsOnUpdate() {
        console.log('changeModelForm', this.changeModelForm)
        console.log('extra_fields', this.changeModelForm.extra_fields)
        this.changeModelForm.extra_fields.push({
          value_name: ''
        })
        console.log('extra_fields 1', this.changeModelForm.extra_fields)
      },
      removeExtraFieldsOnUpdate(item) {
        const index = this.changeModelForm.extra_fields.indexOf(item)
        if (index !== -1) {
          this.changeModelForm.extra_fields.splice(index, 1)
        }
      },
      statusChange(row) {
        updateTemplateWorkOrderModelList(row.id, row).then(() => {
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
      handleEditWorkOrderModel(row) {
        this.updateDialogVisible = true
        if (this.$refs['changeModelForm'] !== undefined) {
          this.$refs['changeModelForm'].resetFields()
        }
        const { id, model_create_time, model_name, mode_status, order_type, order_flow_type, extra_fields } = row
        this.changeModelForm = { id, model_create_time, model_name, mode_status, order_type, order_flow_type, extra_fields }
      },
      handleSubmitWorkOrderModel() {
        this.$refs['changeModelForm'].validate((valid) => {
          if (!valid) {
            return
          }
          this.changeModelForm.extra_fields = JSON.stringify(this.changeModelForm.extra_fields)
          updateTemplateWorkOrderModelList(this.changeModelForm.id, this.changeModelForm).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.updateDialogVisible = false
            this.$emit('fresh', this.searchForm)
          })
        })
      },
      handleAddOrderModel() {
        this.addDialogVisible = true
      },
      handleSubmitAddWorkOrderModel() {
        this.$refs['addModelForm'].validate((valid) => {
          if (!valid) {
            return
          }
          this.addModelForm.extra_fields = JSON.stringify(this.addModelForm.extra_fields)
          addTemplateWorkOrderModelList(this.addModelForm).then(() => {
            this.addDialogVisible = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('fresh', this.searchForm)
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
