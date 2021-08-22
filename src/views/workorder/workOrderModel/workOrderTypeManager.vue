<template>
  <div class="app-container">
    <el-card >
      <div slot="header" style="text-align: center">
        <span>工单类型</span>
        <el-button style="float: right; padding: 3px 0" size="mini" type="text"
                   icon="el-icon-plus"
                   @click="handleAddOrderType">添加</el-button>
      </div>
      <el-table  :show-header="false"
                 :data="templateWorkOrderTypeList"
                 @row-dblclick="handleEditWorkOrderModel"  >
        <el-table-column label="" width="40px" >
          <template slot-scope="scope">
            <el-tooltip >
              <div slot="content">
                创建时间: {{ scope.row.create_time }} <br/><br/>
                修改时间: {{ scope.row.change_time }}<br/><br/>
                关联项目: {{ scope.row.link_project || '暂无项目' }}
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="工单类型" align="center">
          <template slot-scope="scope">
            <el-tooltip content="双击编辑">
              <div slot>{{ scope.row.type_name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         prop="type_status"
                         align="right">
          <template slot-scope="scope">
            <el-switch active-color="#13ce66"
                       v-model="scope.row.type_status"
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
                       :total="templateWorkOrderTypeListTotalNum"
                       v-show="templateWorkOrderTypeListTotalNum>1">
        </el-pagination>
      </div>
      <el-dialog title="编辑类型"  :visible.sync="updateOrderTypeVisible" width="20%" center>
        <el-form ref="updateModelForm" :model="updateModelForm" label-width="80px">
          <el-form-item prop="type_name" label="类型名称">
            <el-input size="small" v-model="updateModelForm.type_name" placeholder="类型名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 5px">
            <el-button type="primary" size="small" @click="handleSubmitWorkOrderModel">确 定</el-button>
            <el-button  size="small" @click="updateOrderTypeVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="创建类型"  :visible.sync="addOrderTypeVisible" width="20%" center>
        <el-form ref="addModelForm" :model="addModelForm" label-width="80px">
          <el-form-item prop="model_name" label="类型名称">
            <el-input size="small" v-model="addModelForm.type_name" placeholder="类型名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 5px">
            <el-button type="primary" size="small" @click="handleSubmitAddWorkOrderModel">确 定</el-button>
            <el-button size="small" @click="addOrderTypeVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { updateTemplateWorkOrderType, addTemplateWorkOrderType } from '@/api/workorder'

  export default {
    name: 'workOrderTypeManager',
    props: ['templateWorkOrderTypeList', 'templateWorkOrderTypeListTotalNum'],
    data() {
      return {
        addOrderTypeVisible: false,
        updateOrderTypeVisible: false,
        addModelForm: {
          type_name: '',
          type_status: 1,
          link_project: ''
        },
        updateModelForm: {
          type_name: '',
          type_status: '',
          link_project: ''
        },
        searchForm: {
          page: 1,
          page_size: 8
        }
      }
    },
    methods: {
      statusChange(row) {
        updateTemplateWorkOrderType(row.id, row).then(() => {
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
      handleAddOrderType() {
        this.addOrderTypeVisible = true
      },
      handleEditWorkOrderModel(row) {
        this.updateOrderTypeVisible = true
        const { id, type_name, type_status, link_project } = row
        this.updateModelForm = { id, type_name, type_status, link_project }
      },
      handleSubmitAddWorkOrderModel() {
        this.$refs['addModelForm'].validate((valid) => {
          if (!valid) {
            return
          }
          addTemplateWorkOrderType(this.addModelForm).then(() => {
            this.addOrderTypeVisible = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('fresh', this.searchForm)
          })
        })
      },
      handleSubmitWorkOrderModel() {
        this.$refs['updateModelForm'].validate((valid) => {
          if (!valid) {
            return
          }
          updateTemplateWorkOrderType(this.updateModelForm.id, this.updateModelForm).then(() => {
            this.updateOrderTypeVisible = false
            this.$message({
              message: '修改成功',
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
