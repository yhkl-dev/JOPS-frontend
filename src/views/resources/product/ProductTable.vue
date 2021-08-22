<template>
  <div class="app-container">
    <el-table class="table"
              v-loading="serverListLoading"
              element-loading-text="拼命加载中"
              :data="serverList"
              :show-header="false"
              v-show="showServerListTable">
      <el-table-column  prop="resource_name"
                        label="资源名称"
                        align="left">
      </el-table-column>
      <el-table-column  prop="manage_ip"
                        label="管理IP"
                        align="center">
      </el-table-column>
    </el-table>
    <div class="text-center" v-show="serverListTotalNum>=10">
      <el-pagination background
                     @current-change="paginationChange"
                     layout="total, prev, pager, next, jumper"
                     :current-page.sync="serverListPage"
                     :total="serverListTotalNum">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'ProductTable',
    props: ['serverListLoading', 'serverListTotalNum', 'serverList', 'showServerListTable', 'serverListPage'],
    methods: {
      paginationChange(val) {
        this.$emit('paginationChange', val)
      }
    }
  }
</script>

<style scoped>

</style>
