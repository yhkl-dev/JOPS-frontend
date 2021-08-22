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
    <div class="filter-container"
         style="margin-bottom: 10px; margin-top: 20px; position: relative;">
      <el-row :gutter="24">
        <el-col :span="18" >
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="handleAddWorkOrderTask">新建工单</el-button>
          <el-button type="primary"
                     size="small"
                     icon="el-icon-refresh"
                     @click="handleRefresh">刷 新</el-button>
        </el-col>
        <el-col :span="6">
          <el-pagination background
                         @current-change="paginationChange"
                         :pager-count="5"
                         size="mini"
                         :page-size="searchForm.page_size"
                         layout="total, prev, pager, next, jumper"
                         :current-page.sync="searchForm.page"
                         :total="taskTotalNum"
                         v-show="taskTotalNum>=0">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-table :data="workOrderTaskList"
              v-loading="loading"
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
          <span v-for="item in scope.row.order_env_type">
            <el-tag size="mini"> {{ item.name }}</el-tag>
            <span> </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="当前执行"
                       width="80px"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.current_exec_user || '——' }}
        </template>
      </el-table-column>
      <el-table-column label="当前审核"
                       width="80px"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.current_audit_user || '——' }}
        </template>
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
                       width="140px">
        <template slot-scope="scope">
          <el-button type="primary"
                     plain
                     size="mini"
                     icon="el-icon-document" circle
                     @click="checkWorkOrderTaskDetail(scope.row)">
          </el-button>
          <el-button type="warning"
                     size="mini"
                     icon="el-icon-edit" circle
                     v-if="scope.row.status_code === 1 "
                     @click="editWorkOrderTaskDetail(scope.row)">
          </el-button>
          <el-button type="success"
                     size="mini"
                     icon="el-icon-check" circle
                     v-if="scope.row.status_code === 1"
                     @click="submitWorkOrderTaskDetail(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="workOrderTaskDetailVisible"
               width="70%"
               center
               @closed="restOrderField">
      <template slot="title">
        <span><h3>工单详情</h3></span>
      </template>
      <work-order-detail v-bind:workOrderDetail="workOrderDetail"
                         @replyWorkOrderTaskForm="replyWorkOrderTaskForm"
                         @handleWorkOrderOperation="handleWorkOrderOperation">
      </work-order-detail>
    </el-dialog>
    <el-dialog title="新建工单"
               center
               :visible.sync="workOrderTaskVisible"
               width="40%" >
      <el-form ref="addWorkOrderTaskForm"
               :rules="rules"
               :model="addWorkOrderTaskForm"
               label-width="110px">
        <el-form-item label="工单标题" prop="order_title">
          <el-input v-model="addWorkOrderTaskForm.order_title"
                    placeholder="请输入工单标题">
          </el-input>
        </el-form-item>
        <el-form-item label='工单类型' prop="template_order_model">
          <el-select v-model="addWorkOrderTaskForm.template_order_model"
                     @change="handleShowItems()"
                     style="width: 100%" placeholder="请选择工单类型">
            <el-option v-for="(item, index) in workOrderModelList"
                       :key="index"
                       :label="item.model_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in extraFields"
                      :key="index"
                      :label="item.value_name">
          <el-input v-model="item.value" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工单需求"  prop="order_purpose">
          <el-input v-model="addWorkOrderTaskForm.order_purpose"
                    type="textarea"
                    :rows="8"
                    placeholder="请输入工单需求">
          </el-input>
        </el-form-item>
        <el-form-item label="平台环境类型" prop="order_env_type">
          <el-select v-model="addWorkOrderTaskForm.order_env_type"
                     multiple
                     style="width: 100%"
                     placeholder="请选择平台环境类型">
            <el-option v-for="(item, index) in workOrderEnvTypeList"
                       :key="index"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源环境类型" prop="order_products">
          <el-select v-model="addWorkOrderTaskForm.order_products"
                     style="width: 100%"
                     placeholder="请选择资源环境类型">
            <el-option v-for="(item, index) in productList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="order_project">
          <el-select v-model="addWorkOrderTaskForm.order_project"
                     style="width: 100%"
                     placeholder="请选择项目">
            <el-option v-for="(item, index) in projectList"
                       :key="index"
                       :label="item.project_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="order_files" >
          <el-upload ref="upload"
                     :action="upLoadUrl"
                     :on-remove="handleRemove"
                     :on-change="handleFileChange"
                     :file-list="fileList"
                     :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">如内容较多可上传文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleCommitAddWorkOrderTask">立即创建</el-button>
          <el-button size="small"
                     @click="workOrderTaskVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="编辑"
               center
               :visible.sync="updateWorkOrderTaskVisible"
               width="40%">
      <el-form ref="editWorkOrderTaskForm"
               :model="editWorkOrderTaskForm"
               label-width="100px">
        <el-form-item label="工单id">
          <el-input v-model="editWorkOrderTaskForm.order_task_id"
                    disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="工单标题">
          <el-input v-model="editWorkOrderTaskForm.order_title"
                    placeholder="请输入工单标题">
          </el-input>
        </el-form-item>
        <el-form-item label='工单类型'>
          <el-select v-model="editWorkOrderTaskForm.template_order_model"
                     style="width: 100%" placeholder="请选择工单类型">
            <el-option v-for="(item, index) in workOrderModelList"
                       :key="index"
                       :label="item.model_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in extraFields"
                      :key="index"
                      :label="item.value_name">
          <el-input v-model="item.value" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="工单需求">
          <el-input v-model="editWorkOrderTaskForm.order_purpose"
                    type="textarea"
                    :rows="8"
                    placeholder="请输入工单需求">
          </el-input>
        </el-form-item>
        <el-form-item label="平台环境类型" prop="order_env_type">
          <el-select v-model="editWorkOrderTaskForm.order_env_type"
                     multiple
                     style="width: 100%"
                     placeholder="请选择平台环境类型">
            <el-option v-for="(item, index) in workOrderEnvTypeList"
                       :key="index"
                       :label="item.name"
                       :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源环境类型" prop="editWorkOrderTaskForm.order_products">
          <el-select v-model="editWorkOrderTaskForm.order_products"
                     style="width: 100%"
                     placeholder="请选择资源环境类型">
            <el-option v-for="(item, index) in productList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="editWorkOrderTaskForm.order_project">
          <el-select v-model="editWorkOrderTaskForm.order_project"
                     style="width: 100%"
                     placeholder="请选择项目">
            <el-option v-for="(item, index) in projectList"
                       :key="index"
                       :label="item.project_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传附件" prop="order_files">
          <el-input size="mini" v-model="editWorkOrderTaskForm.order_files" disabled></el-input>
          <el-upload ref="upload"
                     :action="upLoadUrl"
                     :on-remove="handleRemove"
                     :on-change="handleUpdateFileChange"
                     :file-list="fileList"
                     :auto-upload="false">
            <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">如内容较多可上传文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="handleCommitUpdateWorkOrderTask">保 存</el-button>
          <el-button type="primary"
                     size="small"
                     @click="submitWorkOrderTaskDetailInUpdateForm">提 交</el-button>
          <el-button size="small"
                     @click="updateWorkOrderTaskVisible === false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { addWorkOrderOperation, updateWorkOrderTask, getTemplateWorkOrderModelById } from '@/api/workorder'
  import workOrderDetail from './workOrderDetail'

  export default {
    name: 'MyWorkOrderList',
    components: { workOrderDetail },
    props: ['workOrderTaskList', 'taskTotalNum', 'workOrderModelList', 'loading', 'productList', 'projectList'],
    data() {
      return {
        workOrderTaskDetailVisible: false,
        updateWorkOrderTaskVisible: false,
        workOrderTaskVisible: false,
        workOrderEnvTypeList: [
          { id: 1, name: '前端' },
          { id: 0, name: '后台' },
          { id: 2, name: '安卓' }
        ],
        workOrderDetail: {},
        fileList: [],
        extraFields: [],
        extraFieldValues: [],
        addWorkOrderTaskForm: {
          order_title: '',
          order_purpose: '',
          order_files: '',
          order_env_type: [],
          order_products: '',
          order_project: '',
          extra_fields: [],
          order_status: 1,
          template_order_model: ''
        },
        editWorkOrderTaskForm: {
          id: '',
          order_title: '',
          order_task_id: '',
          order_purpose: '',
          order_files: '',
          order_env_type: [],
          order_products: '',
          order_project: '',
          order_status: 1,
          template_order_model: '',
          extra_fields: []
        },
        searchForm: {
          order_task_id: '',
          order_title: '',
          template_order_model: '',
          create_time_before: '',
          create_time_after: '',
          page: 1,
          page_size: 5
        },
        workOrderOperationForm: {
          ops_status: '',
          work_order: ''
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
        dateValue: '',
        upLoadUrl: '',
        oldValue: '',
        rules: {
          order_title: [
            { required: true, message: '请输入工单标题', trigger: 'blur' }
          ],
          order_purpose: [
            { required: true, message: '请输入需求描述', trigger: 'blur' }
          ],
          template_order_model: [
            { required: true, message: '请选择工单类型', trigger: 'change' }
          ],
          order_env_type: [
            { required: true, message: '请至少选择一个平台环境类型', trigger: 'change' }
          ],
          order_products: [
            { required: true, message: '请选择资源环境类型', trigger: 'change' }
          ],
          order_project: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleShowItems() {
        getTemplateWorkOrderModelById(this.addWorkOrderTaskForm.template_order_model).then(
          res => {
            this.extraFields = []
            res.extra_fields.forEach(item => {
              const item_value = {
                value_name: item.value_name,
                value: ''
              }
              this.extraFields.push(item_value)
            })
          })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handleFileChange(file, fileList) {
        if (fileList.length > 0) {
          const file = fileList[fileList.length - 1]
          this.fileList = [file]
          this.addWorkOrderTaskForm.order_files = file.raw
        } else {
          this.fileList = []
        }
      },
      handleUpdateFileChange(file, fileList) {
        if (fileList.length > 0) {
          const file = fileList[fileList.length - 1]
          this.fileList = [file]
          this.editWorkOrderTaskForm.order_files = file.raw
        } else {
          this.fileList = []
        }
      },
      handleRefresh() {
        this.$emit('refresh')
      },
      handleFilter() {
        if (this.dateValue === null || this.dateValue === '' || this.dateValue.length === 0) {
          this.searchForm.create_time_before = ''
          this.searchForm.create_time_after = ''
        } else {
          this.searchForm.create_time_before = this.dateValue[1]
          this.searchForm.create_time_after = this.dateValue[0]
        }
        this.$emit('handleSearchTask', this.searchForm)
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.handleFilter()
      },
      checkWorkOrderTaskDetail(row) {
        this.workOrderTaskDetailVisible = true
        this.workOrderDetail = row
      },
      restOrderField() {
        this.workOrderTaskDetailVisible = false
        this.$refs['workOrderDetail'].resetFields()
      },
      handleAddWorkOrderTask() {
        this.workOrderTaskVisible = true
        if (this.$refs['addWorkOrderTaskForm'] !== undefined) {
          this.$refs['addWorkOrderTaskForm'].resetFields()
          this.extraFields = []
        }
      },
      handleCommitAddWorkOrderTask: function() {
        this.$refs['addWorkOrderTaskForm'].validate((valid) => {
          if (valid) {
            const formData = new FormData()
            formData.append('order_title', this.addWorkOrderTaskForm.order_title)
            formData.append('extra_fields', JSON.stringify(this.extraFields))
            formData.append('order_purpose', this.addWorkOrderTaskForm.order_purpose)
            formData.append('order_env_type', this.addWorkOrderTaskForm.order_env_type.toString())
            formData.append('order_products', this.addWorkOrderTaskForm.order_products)
            formData.append('order_project', this.addWorkOrderTaskForm.order_project)
            formData.append('order_status', this.addWorkOrderTaskForm.order_status)
            formData.append('template_order_model', this.addWorkOrderTaskForm.template_order_model)
            formData.append('order_files', this.addWorkOrderTaskForm.order_files)
            this.$emit('handleCommitAddWorkOrderTask', formData)
            this.workOrderTaskVisible = false
          }
        })
      },
      replyWorkOrderTaskForm(data) {
        addWorkOrderOperation(data).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.fetchData()
        })
      },
      handleWorkOrderOperation(data) {
        addWorkOrderOperation(data).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.workOrderTaskDetailVisible = false
          this.$emit('refresh')
        })
      },
      submitWorkOrderTaskDetail(row) {
        this.workOrderOperationForm.ops_status = 1
        this.workOrderOperationForm.work_order = row.id
        addWorkOrderOperation(this.workOrderOperationForm).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.updateWorkOrderTaskVisible = false
          this.$emit('refresh')
        })
      },
      submitWorkOrderTaskDetailInUpdateForm() {
        this.workOrderOperationForm.ops_status = 1
        this.workOrderOperationForm.work_order = this.editWorkOrderTaskForm.id
        addWorkOrderOperation(this.workOrderOperationForm).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.updateWorkOrderTaskVisible = false
          this.$emit('refresh')
        })
      },
      editWorkOrderTaskDetail(row) {
        this.updateWorkOrderTaskVisible = true
        const { id, order_title, order_task_id, status_code, order_purpose, order_products, order_env_type, order_project, order_files, template_order_model, extra_fields } = row
        this.editWorkOrderTaskForm = { id, order_title, order_task_id: order_task_id, order_status: status_code, order_purpose, order_products, order_env_type, order_project, order_files, template_order_model, extra_fields }
        this.extraFields = []
        getTemplateWorkOrderModelById(this.editWorkOrderTaskForm.template_order_model).then(
          res => {
            res.extra_fields.forEach(item => {
              if (this.editWorkOrderTaskForm.extra_fields.length !== 0) {
                this.editWorkOrderTaskForm.extra_fields.forEach(field => {
                  if (field.value_name === item.value_name) {
                    const item_value = {
                      value_name: item.value_name,
                      value: field.value
                    }
                    this.extraFields.push(item_value)
                  }
                })
              } else {
                const item_value = {
                  value_name: item.value_name,
                  value: ''
                }
                this.extraFields.push(item_value)
              }
            })
          })
        this.oldValue = row.order_files
      },
      handleCommitUpdateWorkOrderTask: function() {
        if (this.oldValue === this.editWorkOrderTaskForm.order_files) {
          delete this.editWorkOrderTaskForm.order_files
          const env_type = []
          this.editWorkOrderTaskForm.order_env_type.forEach(item => {
            env_type.push(item.name)
          })
          this.editWorkOrderTaskForm.order_env_type = env_type.toString()
          this.editWorkOrderTaskForm.extra_fields = JSON.stringify(this.extraFields)
          updateWorkOrderTask(this.editWorkOrderTaskForm.id, this.editWorkOrderTaskForm).then(() => {
            this.updateWorkOrderTaskVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('refresh')
          })
        } else {
          const formData = new FormData()
          formData.append('order_title', this.editWorkOrderTaskForm.order_title)
          formData.append('order_task_id', this.editWorkOrderTaskForm.order_task_id)
          formData.append('order_purpose', this.editWorkOrderTaskForm.order_purpose)
          const env_type = []
          this.editWorkOrderTaskForm.order_env_type.forEach(item => {
            env_type.push(item.name)
          })
          this.editWorkOrderTaskForm.order_env_type = env_type.toString()
          formData.append('order_env_type', this.editWorkOrderTaskForm.order_env_type)
          formData.append('order_products', this.editWorkOrderTaskForm.order_products)
          formData.append('order_project', this.editWorkOrderTaskForm.order_project)
          formData.append('order_status', this.editWorkOrderTaskForm.order_status)
          formData.append('template_order_model', this.editWorkOrderTaskForm.template_order_model)
          formData.append('order_files', this.editWorkOrderTaskForm.order_files)
          updateWorkOrderTask(this.editWorkOrderTaskForm.id, formData).then(() => {
            this.updateWorkOrderTaskVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('refresh')
          })
        }
      }
    }
  }
</script>

<style scoped>
  .div_class {
    margin-left: 20px;
    position: relative;
  }
</style>
