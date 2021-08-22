<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" size="mini" @click="handleFlush">刷新</el-button>
      <el-button type="primary" size="mini" @click="handleSetRead">设为已读</el-button>
    </div>
    <el-table ref="multipleTable"
              :data="userMessage"
              v-loading="loading"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" >
      </el-table-column>
      <el-table-column prop="sender"
                       width="200px"
                       label="发送人"></el-table-column>
      <el-table-column prop="is_read"
                       width="150px"
                       label="状态"></el-table-column>
      <el-table-column prop="message_type" width="150px"  label="类型"></el-table-column>
      <el-table-column prop="create_time" width="200px"  label="时间"></el-table-column>
      <el-table-column prop="message_text" label="内容"></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @current-change="paginationChange"
        :pager-count="5"
        size="mini"
        :page-size="searchForm.page_size"
        layout="total, prev, pager, next"
        :current-page.sync="searchForm.page"
        :total="totalNum"
        v-show="totalNum>=0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getMessage, updateMessageStatus } from '@/api/messages'

  export default {
    name: 'UserMessages',
    data() {
      return {
        userMessage: [],
        multipleSelection: [],
        totalNum: 0,
        isSelect: false,
        loading: true,
        searchForm: {
          page: 1,
          per_page: 10
        }
      }
    },
    methods: {
      fetchData(params) {
        this.loading = true
        getMessage(params).then(
          res => {
            this.userMessage = res.results
            this.totalNum = res.count
            this.loading = false
          }
        )
      },
      handleFlush() {
        this.fetchData(this.searchForm)
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.fetchData(this.searchForm)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleSetRead() {
        if (this.multipleSelection.length !== 0) {
          this.multipleSelection.forEach(select => {
            if (select.is_read !== '已读') {
              updateMessageStatus(select.id, { is_read: 2 }).then(() => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              })
            } else {
              //
            }
          })
          this.handleFlush()
        } else {
          //
        }
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    created() {
      this.fetchData(this.searchForm)
    }
  }
</script>

<style scoped>

</style>
