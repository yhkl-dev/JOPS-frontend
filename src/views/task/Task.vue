<template>
    <div class="app-container">
      <div class="filter-container">
        <el-row :gutter="24">
          <el-col :span="3">
            <el-select
              v-model="searchForms.currentTaskType"
              placeholder="任务模式"
              size="small"
              default-first-option
              @change="HandleTaskTypeChange">
              <el-option
                v-for="item in taskType"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="searchForms.currentTaskType"
              placeholder="任务模式"
              size="small"
              default-first-option
              @change="HandleTaskTypeChange">
              <el-option
                v-for="item in taskType"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="searchForms.currentTaskType"
              placeholder="任务模式"
              size="small"
              default-first-option
              @change="HandleTaskTypeChange">
              <el-option
                v-for="item in taskType"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="searchForms.status"
              placeholder="执行状态"
              clearable
              size="small"
              default-first-option >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input
              v-model="searchForms.name"
              placeholder="任务名称"
              style="width: 200px;" size="small" @keyup.enter.native="handleFilter" >
            </el-input>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              size='small'
              icon="el-icon-search"
              @click="handleFilter">
              搜 索
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              size='small'
              type="primary"
              icon="el-icon-edit"
              @click="handleAddBtn">
              添 加
            </el-button>
          </el-col>
        </el-row>

      </div>
      <el-tabs
        v-model="activeName"
        type="border-card">
        <el-tab-pane
          label="Playbook"
          name="Playbook" >
          <PlaybookTask
            v-bind:params="params"
            v-bind:taskList="taskList"
            v-bind:statusOptions="statusOptions"
            v-bind:totalNum="totalNum"
            @handleCurrentPlaybookChange="handleCurrentPlaybookChange"
            @handleEditPlaybookClick="handleEditPlaybookClick"
            @handleDeletePlaybookClick="handleDeletePlaybookClick">
          </PlaybookTask>
        </el-tab-pane>
        <el-tab-pane
          label="Ad-hoc"
          name="Ad-hoc">
          <AdhocTask
            v-bind:params="params"
            v-bind:adhocTaskLists="adhocTaskLists"
            v-bind:statusOptions="statusOptions"
            v-bind:adhocTotalNum="adhocTotalNum"
            @handleEditAdhocClick="handleEditAdhocClick"
            @handleDeleteAdhocClick="handleDeleteAdhocClick"
            @handleCurrentChangeAdhoc="handleCurrentChangeAdhoc">
          </AdhocTask>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="添加任务"
        center
        :visible.sync="dialogVisibleForAdd"
        width="15%">
        <div
          slot="footer"
          class="dialog-footer">
          <el-button
            size="small"
            type="primary"
            @click="dialogVisibleForAddPlaybook = true">
            Playbook
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="dialogVisibleForAddAdhoc = true">
            Ad-hoc
          </el-button>
        </div>
        <el-dialog
          title="添加Playbook任务"
          center
          :visible.sync="dialogVisibleForAddPlaybook"
          :append-to-body="true"
          width="30%" >
          <el-form
            ref="addTaskPolicy"
            :model="addPlaybookTask"
            label-width="100px" >
            <el-form-item
              label="任务名称"
              prop="name">
              <el-input
                v-model="addPlaybookTask.name"
                placeholder="请输入任务名称" >
              </el-input>
            </el-form-item>
            <el-form-item
              label="playbook"
              prop="playbook" >
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="upLoadUrl"
                :on-remove="handleRemove"
                :on-change="handleFileChange"
                :file-list="fileList"
                :auto-upload="false">
                <el-button
                  slot="trigger"
                  size="small"
                  type="primary">选取文件</el-button>
                <div
                  slot="tip"
                  class="el-upload__tip">
                  只能上传yml文件
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer">
            <el-button
              size="small"
              type="primary"
              @click="handleSubmitAddPlaybookTask">
              确 定
            </el-button>
            <el-button
              size="small"
              @click="dialogVisibleForAddPlaybook = false">
              取 消
            </el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="添加Ad-hoc任务"
          center
          :visible.sync="dialogVisibleForAddAdhoc"
          :append-to-body="true"
          width="30%">
          <el-form
            ref="addAdHocTask"
            :model="addAdHocTask"
            label-width="100px" >
            <el-form-item
              label="任务名称"
              prop="name">
              <el-input
                v-model="addAdHocTask.name"
                placeholder="请输入任务名称" >
              </el-input>
            </el-form-item>
            <el-form-item
              label="执行主机IP"
              prop="exec_host">
              <el-input
                v-model="addAdHocTask.exec_host"
                placeholder="执行主机IP， 多个主机IP以逗号（,）分隔" >
              </el-input>
            </el-form-item>
            <el-form-item
              label="执行模块名称"
              prop="model_name">
              <el-select
                v-model="addAdHocTask.model_name"
                placeholder="请选择模块名称"
                style="width: 100%">
                <el-option
                  v-for="item in moduleNameSelect"
                  :key="item"
                  :label="item"
                  :value="item"
                  size="medium">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="执行模块参数"
              prop="model_args">
              <el-input
                v-model="addAdHocTask.model_args"
                placeholder="请输入执行模块参数" >
              </el-input>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer">
            <el-button
              size="small"
              type="primary"
              @click="handleSubmitAddAdHocTask">
              确 定
            </el-button>
            <el-button
              size="small"
              @click="dialogVisibleForAddAdhoc = false">
              取 消
            </el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </div>
</template>

<script>
  import { getTaskLists, executeTask, createTask, getAdhocTaskLists, createAdhocTask, executeAdhocTask } from '@/api/tasks'
  import elDragDialog from '@/directive/el-drag-dialog'
  import AdhocTask from './AdhocTask'
  import PlaybookTask from './PlaybookTask'

  export default {
    name: 'Task',
    directives: { elDragDialog },
    components: { AdhocTask, PlaybookTask },
    filters: {
      statusFilter(status) {
        const statusMap = {
          Y: 'success',
          N: 'info',
          R: 'warning'
        }
        return statusMap[status]
      },
      resultFilter(result) {
        const resultMap = {
          skipped: 'info',
          failed: 'danger',
          ok: 'success',
          status: 'success',
          unreachable: 'warning',
          changed: 'text'
        }
        return resultMap[result]
      }
    },
    data() {
      return {
        statusChange: false,
        activeName: 'Playbook',
        taskType: ['Playbook', 'Ad-hoc'],
        loading: false,
        upLoadUrl: '',
        intervalId: 0,
        intervalIdAdhoc: 0,
        taskList: [],
        adhocTaskLists: [],
        fileList: [],
        currentTaskType: '',
        statusOptions: ['已执行', '未执行', '执行中'],
        moduleNameSelect: ['copy', 'ping', 'cron', 'service', 'shell', 'script', 'yum', 'setup', 'file', 'group', 'user', 'stat', 'mount'],
        totalNum: 0,
        adhocTotalNum: 0,
        dialogTableVisible: false,
        dialogVisibleForAdd: false,
        dialogVisibleForAddPlaybook: false,
        dialogVisibleForAddAdhoc: false,
        result_page: 1,
        detail_result: '',
        addPlaybookTask: {
          name: '',
          status: 'N',
          playbook: ''
        },
        addAdHocTask: {
          name: '',
          status: 'N',
          exec_host: '',
          model_name: '',
          model_args: ''
        },
        params: {
          type: '',
          name: '',
          status: '',
          page: 1
        },
        adhocParams: {
          type: '',
          name: '',
          status: '',
          page: 1
        },
        searchForms: {
          currentTaskType: '',
          status: '',
          name: ''
        }
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getTaskLists(this.params).then(
          res => {
            this.taskList = res.results
            this.taskList.forEach(r => {
              try {
                r.result_view = JSON.parse(r.result_view.replace(/'/g, '"'))
              } catch (e) {
                console.log(e)
              }
            })
            this.totalNum = res.count
            this.loading = false
          }
        )
        getAdhocTaskLists(this.adhocParams).then(
          res => {
            this.adhocTaskLists = res.results
            this.adhocTaskLists.forEach(r => {
              try {
                r.result_view = JSON.parse(r.result_view.replace(/'/g, '"'))
              } catch (e) {
                console.log(e)
              }
            })
            this.adhocTotalNum = res.count
            this.loading = false
          }
        )
      },
      handleFileChange(file, fileList) {
        if (fileList.length > 0) {
          const file = fileList[fileList.length - 1]
          this.fileList = [file]
          this.addPlaybookTask.playbook = file.raw
        } else {
          this.fileList = []
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handleEditAdhocClick(data) {
        executeAdhocTask(data['id'], data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      },
      handleEditPlaybookClick(data) {
        executeTask(data['id'], data).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      },
      handleCurrentPlaybookChange(val) {
        this.params.page = val
        this.fetchData()
      },
      handleCurrentChangeAdhoc(val) {
        this.adhocParams.page = val
        this.fetchData()
      },
      handleDeletePlaybookClick(data) {
        this.$confirm('是否删除 ' + '[' + data['name'] + ']', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          executeTask(data['id'], data).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          }).catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
        })
      },
      handleDeleteAdhocClick(data) {
        this.$confirm('是否删除 ' + data['name'], '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          executeAdhocTask(data['id'], data).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          }).catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
        })
      },
      handleDrag(row) {
        this.dialogTableVisible = true
        this.detail_result = JSON.parse(row.detail_result)
      },
      handleFilter() {
        if (this.activeName === 'Playbook') {
          this.params.page = 1
          if (this.searchForms.status === '未执行') {
            this.params.status = 'N'
          } else if (this.searchForms.status === '已执行') {
            this.params.status = 'Y'
          } else if (this.searchForms.status === '执行中') {
            this.params.status = 'R'
          } else {
            this.params.status = ''
          }
          this.params.name = this.searchForms.name
          this.fetchData()
        } else if (this.activeName === 'Ad-hoc') {
          this.adhocParams.page = 1
          if (this.searchForms.status === '未执行') {
            this.adhocParams.status = 'N'
          } else if (this.searchForms.status === '已执行') {
            this.adhocParams.status = 'Y'
          } else if (this.searchForms.status === '执行中') {
            this.adhocParams.status = 'R'
          } else {
            this.adhocParams.status = ''
          }
          this.adhocParams.name = this.searchForms.name
          this.fetchData()
        }
      },
      handleCancelAddPlaybook() {
        this.dialogVisibleForAddPlaybook = false
        this.dialogVisibleForAdd = false
      },
      handleCancelAddAdhoc() {
        this.dialogVisibleForAddAdhoc = false
        this.dialogVisibleForAdd = false
      },
      handleAddBtn() {
        this.dialogVisibleForAdd = true
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      HandleTaskTypeChange() {
        this.activeName = this.searchForms.currentTaskType
      },
      handleSubmitAddAdHocTask() {
        createAdhocTask(this.addAdHocTask).then(res => {
          this.$message({
            message: '创建Ad-hoc任务成功',
            type: 'success'
          })
          this.handleCancelAddAdhoc()
          this.fetchData()
        })
      },
      handleSubmitAddPlaybookTask() {
        const formData = new FormData()
        formData.append('name', this.addPlaybookTask.name)
        formData.append('playbook', this.addPlaybookTask.playbook)
        createTask(formData).then(res => {
          this.$message({
            message: '创建任务成功',
            type: 'success'
          })
          this.handleCancelAddPlaybook()
          this.fetchData()
        })
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      taskList(val) {
        if (!this.intervalId && this.taskList.some(r => r.status === 'R')) {
          this.intervalId = setInterval(() => {
            this.fetchData()
          }, 5000)
        } else if (this.intervalId && this.taskList.every(r => r.status !== 'R')) {
          clearInterval(this.intervalId)
          this.intervalId = null
        }
      },
      adhocTaskLists(val) {
        if (!this.intervalIdAdhoc && this.adhocTaskLists.some(r => r.status === 'R')) {
          this.intervalIdAdhoc = setInterval(() => {
            this.fetchData()
          }, 5000)
        } else if (this.intervalIdAdhoc && this.adhocTaskLists.every(r => r.status !== 'R')) {
          clearInterval(this.intervalIdAdhoc)
          this.intervalIdAdhoc = null
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.intervalId)
      clearInterval(this.intervalIdAdhoc)
    }
  }
</script>

<style lang="scss" scoped>
 .divcalss {
   background: #1f2d3d;
   color: #1f2d3d;
   overflow:scroll;
   height: 600px;
   user-select: text;
 }
  .el-pagination {
    margin-top: 15px;
  }

</style>
