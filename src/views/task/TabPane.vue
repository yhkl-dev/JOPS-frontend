<template>
  <el-table :data="taskList" v-loading="loading"  element-loading-text="Loading..." border  size="medium " highlight-current-row style="width: 100%"
  >
    <el-table-column label="ID" prop="id" align="center" width="80">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name"  label="任务名称" width="200px" align="center"></el-table-column>
    <el-table-column prop="playbook"  label="playbook" ></el-table-column>
    <el-table-column prop="add_time"  label="创建时间" width="250px" align="center"></el-table-column>
    <el-table-column prop="exec_time"  label="执行时间" width="250px" align="center"></el-table-column>
    <el-table-column label="状态" class-name="status-col" align="center" width="100">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter" v-if="row.status === 'Y'">
          已执行
        </el-tag>
        <el-tag :type="row.status | statusFilter" v-if="row.status === 'N'">
          未执行
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="" label="操作" width="200" align="center">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status != 'Y'" size="mini" type="primary"  plain @click="handleEditClick(scope.row)">执行</el-button>
        <el-button  v-if="scope.row.status != 'N'" size="mini" type="primary" plain @click="handleDrag(scope.row)">查看</el-button>
        <el-button size="mini" type="danger" @click="handleDeleteClick(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    <div class="text-center" v-show="totalNum>=10">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="result_page"
        :total="totalNum">
      </el-pagination>
    </div>
  </el-table>
</template>

<script>
  import { getTaskLists, executeTask, createTask, deleteTask } from '@/api/tasks'
  import elDragDialog from '@/directive/el-drag-dialog'
  export default {
    name: 'Task',
    directives: { elDragDialog },
    filters: {
      statusFilter(status) {
        const statusMap = {
          Y: 'success',
          N: 'info'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        tabMapOptions: [
          { label: 'Playbook', key: 'Playbook' },
          { label: 'Ad-hoc', key: 'Ad-hoc' }
        ],
        activeName: 'Playbook',
        loading: false,
        taskList: [],
        fileList: [],
        statusOptions: ['已执行', '未执行'],
        totalNum: 0,
        jsonData: '',
        dialogTableVisible: false,
        dialogVisibleForAdd: false,
        result_page: 1,
        upLoadUrl: 'http://192.168.75.138:8000/task/',
        ChangeTaskStatus: {
          id: '',
          name: '',
          status: 'Y'
        },
        listQuery: {
          name: '',
          status: '',
          page: ''
        },
        addTask: {
          name: '',
          status: 'N',
          playbook: ''
        },
        detail_result: '',
        params: {
          name: '',
          status: '',
          page: 1
        }
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getTaskLists(this.params).then(
          res => {
            this.taskList = res.results
            this.totalNum = res.count
            this.loading = false
          }
        )
      },
      updateTask(row) {
        if (this.$refs['ChangeTaskStatus'] !== undefined) {
          this.$refs['ChangeTaskStatus'].resetFields()
        }
        const { id, name, status } = row
        this.ChangeTaskStatus = { id, name, status }
        this.ChangeTaskStatus.status = 'Y'
      },
      handleFileChange(file, fileList) {
        if (fileList.length > 0) {
          const file = fileList[fileList.length - 1]
          this.fileList = [file]
          this.addTask.playbook = file.raw
        } else {
          this.fileList = []
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handleCurrentChange(val) {
        this.params.page = val
        this.fetchData()
      },
      handleEditClick(row) {
        this.updateTask(row)
        executeTask(this.ChangeTaskStatus.id, this.ChangeTaskStatus).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      },

      handleDeleteClick(row) {
        this.$confirm('是否删除 ' + row.name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTask(row.id).then(() => {
            this.$message({
              message: '删除任务成功',
              type: 'success'
            })
            // if (this.serverList.length === 1 && this.searchForm.page > 1) {
            //   this.searchForm.page = this.searchForm.page - 1
            // }
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        })
      },
      handleDrag(row) {
        this.dialogTableVisible = true
        this.detail_result = JSON.parse(row.detail_result)
        // this.detail_result = JSON.stringify(this.detail_result, null, 8)
        // this.$refs.select.blur()
      },
      handleFilter() {
        this.params.page = 1
        if (this.params.status === '未执行') {
          this.params.status = 'N'
        } else if (this.params.status === '已执行') {
          this.params.status = 'Y'
        }
        this.fetchData()
      },
      handleCancelAdd() {
        this.dialogVisibleForAdd = false
        this.addTask = ''
      },
      handleAddBtn() {
        this.dialogVisibleForAdd = true
      },
      submitUpload() {
        this.$refs.upload.submit()
      },
      handleSubmitAdd() {
        // this.submitUpload()
        const formData = new FormData()
        formData.append('name', this.addTask.name)
        // formData.append('status', this.addTask.status)
        const yml = `
---
- hosts: 192.168.75.138
  tasks:
  - name:  touch file
    shell: 'touch /tmp/ansible_test.log'
        `
        const blob = new Blob([yml])
        formData.append('playbook', blob, 'test4.yml')
        // formData.append('playbook', this.addTask.playbook)
        createTask(formData).then(res => {
          this.$message({
            message: '创建任务成功',
            type: 'success'
          })
          this.handleCancelAdd()
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
  .divcalss {
    background: #000;
    color: #1f2d3d;
    overflow:scroll;
    height: 600px;
    user-select: text;
  }
  .filter-container {
    margin-bottom: 10px;
  }
</style>
