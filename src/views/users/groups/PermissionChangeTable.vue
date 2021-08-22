<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="12" >
          <el-input placeholder="搜索"
                    size="small"
                    v-model="modifyGroupPermissionSearchKeyData"
                    @keyup.enter.native="modifyGroupPermissionSearchClick">
            <el-button slot="append"
                       size="small"
                       icon="el-icon-search"
                       @click="modifyGroupPermissionSearchClick"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="modifyGroupPermissionLoading"
              element-loading-text="拼命加载中"
              :data="modifyGroupPermissionData"
              class="table">
      <el-table-column prop="content_type.app_label"
                       label="app"
                       align="center">
      </el-table-column>
      <el-table-column prop="content_type.model"
                       label="model"
                       align="center">
      </el-table-column>
      <el-table-column prop="codename"
                       label="code name"
                       align="center">
      </el-table-column>
      <el-table-column prop="name"
                       label="描述"
                       align="center">
      </el-table-column>
      <el-table-column prop=""
                       label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     @change="modifyGroupPermissionChangeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container"
         v-show="modifyGroupPermissionTotal>=10">
      <el-pagination @current-change="modifyGroupPermissionPaginationChange"
                     layout="total, prev, pager, next, jumper"
                     page-size="6"
                     :current-page.sync="modifyGroupPermissionPage"
                     :total="modifyGroupPermissionTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PermissionChangeTable',
    props: ['modifyGroupPermissionTotal',
      'modifyGroupPermissionData',
      'modifyGroupPermissionLoading',
      'modifyGroupPermissionSearchKey',
      'modifyGroupPermissionPage'],
    data() {
      return {
        modifyGroupPermissionSearchKeyData: ''
      }
    },
    methods: {
      modifyGroupPermissionChangeStatus(row) {
        this.$emit('modifyGroupPermissionChangeStatus', row)
      },
      modifyGroupPermissionSearchClick() {
        this.$emit('modifyGroupPermissionSearchClick', this.modifyGroupPermissionSearchKeyData)
      },
      modifyGroupPermissionPaginationChange(val) {
        this.$emit('modifyGroupPermissionPaginationChange', val)
      }
    }
  }
</script>

<style scoped>

</style>
