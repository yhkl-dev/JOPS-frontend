<template>
  <div>
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="12" >
          <el-input placeholder="搜索"
                    size="small"
                    v-model="groupMemberSearchData"
                    @keyup.enter.native="groupMemberSearchClick">
            <el-button slot="append"
                       size="small"
                       icon="el-icon-search"
                       @click="groupMemberSearchClick">
            </el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="groupMemberLoading"
              element-loading-text="拼命加载中"
              :data="groupMemberListData"
              stripe>
      <el-table-column prop="username"
                       label="用户名"
                       align="center">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       align="center">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮件"
                       align="center">
      </el-table-column>
      <el-table-column prop="ncfgroupuser.title"
                       label="上次登陆时间"
                       align="center">
      </el-table-column>
      <el-table-column prop=""
                       label="操作"
                       width="80px"
                       align="center">
        <template slot-scope="scope">
          <el-button @click="groupMemberDeleteClick(scope.row)"
                     type="text"
                     size="small">
            删 除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" v-show="groupMemberTotal <= 10">
      <el-pagination
        @current-change="groupMemberPaginationChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="groupMemberPage"
        :total="groupMemberTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GroupMemberTable',
    props: ['groupMemberSearchKey', 'groupMemberTotal', 'groupMemberListData', 'groupMemberLoading', 'groupMemberPage'],
    data() {
      return {
        groupMemberSearchData: ''
      }
    },
    methods: {
      groupMemberSearchClick() {
        console.log(this.groupMemberTotal)
        this.$emit('groupMemberSearchClick', this.groupMemberSearchData)
      },
      groupMemberDeleteClick(row) {
        this.$emit('groupMemberDeleteClick', row)
      },
      groupMemberPaginationChange(val) {
        this.$emit('groupMemberPaginationChange', val)
      }
    }
  }
</script>

<style scoped>

</style>
