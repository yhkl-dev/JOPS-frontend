<template>
  <div class="app-container">
    <el-table v-loading="permissionloading"
              element-loading-text="拼命加载中"
              :data="permissionList"
              height="300">
      <el-table-column type="index"
                       width="50"
                       label="序号"
                       align="center">
      </el-table-column>
      <el-table-column label="权限名"
                       align="center">
        <template slot-scope="scope">
          {{ scope.row.content_type.app_label + '.' + scope.row.codename }}
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="描述"
                       align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'PermissionTable',
    props: ['permissionloading', 'permissionList']
  }
</script>

<style scoped>

</style>
