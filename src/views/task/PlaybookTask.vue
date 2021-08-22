<template>
    <div>
      <el-table :data="taskList"
                v-loading="loading"
                element-loading-text="Loading..."
                border
                size="medium"
                highlight-current-row style="width: 100%" >
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name"  label="任务名称" width="180px" align="center"></el-table-column>
        <el-table-column prop="playbook"  label="playbook" align="center" ></el-table-column>
        <el-table-column label="执行结果" width="480px" align="center">
          <template slot-scope="scope" >
                  <span  v-for="row of scope.row.result_view">
                    <el-tag size="mini "   :type="row.name | resultFilter" >
                    {{row.name}}
                    </el-tag>
                    <span style="color: #4d4d4d;"> {{ row.num }}</span>
                    <span> </span>
                  </span>
          </template>
        </el-table-column>
        <el-table-column prop="exec_time"  label="执行时间" width="170px" align="center"></el-table-column>
        <el-table-column prop="add_time"  label="创建时间" width="170px" align="center"></el-table-column>
        <el-table-column label="状态" class-name="status-col" align="center" width="80">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" v-if="row.status === 'Y'">
              已执行
            </el-tag>
            <el-tag :type="row.status | statusFilter" v-if="row.status === 'N'">
              未执行
            </el-tag>
            <el-tag :type="row.status | statusFilter" v-if="row.status === 'R'">
              执行中
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 'N'" size="mini" type="primary"  plain @click="handleEditClick(scope.row)">执行</el-button>
            <el-button v-if="scope.row.status === 'Y'" size="mini" type="primary"  plain @click="handleEditClick(scope.row)">重新执行</el-button>
            <el-button v-if="scope.row.status === 'R'" size="mini" type="primary"  plain disabled>重新执行</el-button>
            <el-button  v-if="scope.row.status != 'N'" size="mini" type="primary" plain @click="handleDrag(scope.row)">查看详情</el-button>
            <el-button  v-if="scope.row.status === 'N'" :disabled="statusChange" size="mini" type="primary" plain @click="handleDrag(scope.row)"disabled>查看详情</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteClick(scope.row)">删除</el-button>
          </template>
          a
        </el-table-column>

      </el-table>
      <div class="text-center" v-show="totalNum>=10">
        <el-pagination
          background
          @current-change="handleCurrentPlaybookChange"
          layout="total, prev, pager, next, jumper"
          :current-page.sync="result_page"
          :total="totalNum">
        </el-pagination>
      </div>
      <el-dialog v-el-drag-dialog
                 :visible.sync="dialogTableVisible"
                 title="Playbook Result" width="70%"
                 @dragDialog="false && handleDrag(scope.row)">
        <div class="divcalss">
           <span style="color: #f0f8ff; ">
            <pre>{{this.detail_result}}</pre>
          </span>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'

  export default {
    name: 'PlaybookTask',
    directives: { elDragDialog },
    props: ['taskList', 'params', 'statusOptions', 'totalNum'],
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
        loading: false,
        upLoadUrl: '',
        intervalId: 0,
        dialogTableVisible: false,
        jsonData: '',
        result_page: 1,
        flushData: '',
        ChangeTaskStatus: {
          id: '',
          name: '',
          status: 'R'
        },
        deleteTaskStatus: {
          id: '',
          status: '',
          name: '',
          is_visible: 'N'
        },
        detail_result: ''
      }
    },
    methods: {
      updateTask(row) {
        if (this.$refs['ChangeTaskStatus'] !== undefined) {
          this.$refs['ChangeTaskStatus'].resetFields()
        }
        const { id, name, status } = row
        this.ChangeTaskStatus = { id, name, status }
        this.ChangeTaskStatus.status = 'R'
      },
      deleteTask(row) {
        if (this.$refs['deleteTaskStatus'] !== undefined) {
          this.$refs['deleteTaskStatus'].resetFields()
        }
        const { id, is_visible, status, name } = row
        this.deleteTaskStatus = { id, is_visible, status, name }
        this.deleteTaskStatus.is_visible = 'N'
      },
      handleCurrentPlaybookChange(val) {
        this.$emit('handleCurrentPlaybookChange', val)
      },
      handleDrag(row) {
        this.dialogTableVisible = true
        this.detail_result = JSON.parse(row.detail_result)
      },
      handleEditClick(row) {
        this.updateTask(row)
        this.$emit('handleEditPlaybookClick', this.ChangeTaskStatus)
      },
      handleDeleteClick(row) {
        this.deleteTask(row)
        this.$emit('handleDeletePlaybookClick', this.deleteTaskStatus)
      }
    }
  }
</script>

<style  lang="scss" scoped>
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
