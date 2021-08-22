<template>
    <div>
      <el-table :data="resourceTypeList" border >
        <el-table-column  label="资源图标 "  align="center" width="80px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.type_icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column prop="type_name" label="资源类型 "  align="center"></el-table-column>
      </el-table>
    </div>
</template>

<script>
  export default {
    name: 'ResourceType',
    props: ['resourceTypeList']
  }
</script>

<style scoped>

</style>
