<template>
  <div class="app-container">
    <div class="search-area">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button size="mini" type="primary">Add Info</el-button>
        </el-col>
        <el-col :span="6">
          <el-input size="mini" width="200px" placeholder="INPUT IP TO SEARCH" v-model="searchForm.ip">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" type="primary">Refresh</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading"
              element-loading-text="loading"
              size="mini"
              :data="cloudList"
              :header-cell-style="headClass"
              :row-style="rowClass">
      <el-table-column prop="resource_name"  label="Name" align="center"></el-table-column>
      <el-table-column label="Type" align="center" width="80px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.type_name" placement="top-start">
            <svg-icon :icon-class="scope.row.type_icon"></svg-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="belong_user" label="Belong user" align="center"></el-table-column>
      <el-table-column prop="ram_username" label="Account" align="center"></el-table-column>
      <el-table-column prop="description" label="Description" align="center"></el-table-column>
      <el-table-column prop="create_at" label="Create Time" align="center"></el-table-column>
      <el-table-column prop="update_at" label="Update Time" align="center"></el-table-column>
      <el-table-column prop="" label="OPTIONS" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="showCloudServerList(scope.row)">server list</el-button>
          <el-button size="small" type="text" @click="handleEditClick(scope.row)">edit</el-button>
          <el-button size="small" type="text" @click="handlerDeleteResource(scope.row)">delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px"
         class="text-center"
         v-show="ResourcesListTotalNum>=15">
      <el-pagination background
                     @current-change="paginationChange"
                     layout="total, prev, pager, next, jumper"
                     :current-page.sync="page"
                     :total="ResourcesListTotalNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getCloudList, getCloudTypeList } from '@/api/resource'
  export default {
    name: 'CloudResource',
    data() {
      return {
        loading: false,
        page: 1,
        userPage: 1,
        state: 0,
        cloudList: [],
        cloudTypeList: [],
        searchForm: {
          ip: ''
        }
      }
    },
    methods: {
      fetchCloudList(params) {
        this.loading = true
        getCloudList(params).then(
          res => {
            this.cloudList = res.results
            this.loading = false
          }
        )
      },
      fetchCloudTypeList(params) {
        getCloudTypeList(params).then(res => {
          this.cloudTypeList = res.results
        })
      },
      headClass() {
        return 'text-align:center;background:#eef1f6;font-weight:bold;color:#606266'
      },
      rowClass() {
        return 'text-align:center;'
      },
      showCloudServerList(row) {
        console.log(row.id)
      },
      handleEditClick(row) {
        console.log(row)
      },
      handlerDeleteResource(row) {
        console.log(row)
      }
    },
    created() {
      this.state = 1
      this.fetchCloudList()
    }
  }
</script>

<style scoped>
.search-area {
  margin-bottom: 10px;
}
</style>
