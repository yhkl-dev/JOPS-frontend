<template>
  <div class="app-container">
    <div class="search-area">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-tooltip class="item" effect="dark" content="Add server not in cloud list" placement="top-start">
            <el-button size="mini" type="primary" @click="handleAddServer">Add Info</el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <el-input size="mini" width="200px" placeholder="INPUT IP TO SEARCH" v-model="searchForm.ip">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1.5">
          <el-button size="mini" type="primary" @click="fetchCloudSeverList">Refresh</el-button>
          <el-tooltip class="item" effect="dark" content="fetch server info from cloud" placement="top-start">
            <el-button size="mini" type="primary" @click="refetchServer">Refetch</el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading"
              element-loading-text="loading"
              :header-cell-style="headClass"
              :row-style="rowClass"
              size="mini"
              :data="instanceList">
      <el-table-column prop="InstanceName" label="Instance ID/Name" width="200px">
        <template slot-scope="scope">
          <span>
            {{ scope.row.InstanceName }}
            <br/>
            <span style="color: blue">{{ scope.row.HostName }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="resource_name" label="Instance" width="150px" ></el-table-column>
      <el-table-column prop="IpAddress" label="Public IP"></el-table-column>
      <el-table-column label="OS Type" align="center">
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="resolveIcon(scope.row.OSType)"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="OSNameEn" label="OS Name" align="center"></el-table-column>
      <el-table-column label="Status" align="center" width="60px">
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="resolveIcon(scope.row.Status)"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="Cpu" label="Cpu" align="center" width="50px"></el-table-column>
      <el-table-column prop="Memory" label="Memory" align="center"></el-table-column>
      <el-table-column prop="RegionId" label="RegionId" align="center"></el-table-column>
      <el-table-column prop="CreationTime" label="Creation Time" align="center" width="140px"></el-table-column>
      <el-table-column prop="StartTime" label="Start Time" align="center" width="140px"></el-table-column>
      <el-table-column prop="ExpiredTime" label="Expired Time" align="center" width="140px"></el-table-column>
      <el-table-column prop="LastUpdateTime" label="Last Update Time" align="center" width="140px"></el-table-column>
      <el-table-column prop="" label="options" align="center">
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="handleEditClick(scope.row)">edit</el-button>
        <el-button size="small" type="text" @click="handlerDeleteResource(scope.row)">delete</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div style="margin-top: 10px"
         v-show="resourcesListTotalNum>=10">
      <el-pagination @current-change="paginationChange"
                     layout="total, prev, pager, next, jumper"
                     :current-page.sync="page"
                     :total="resourcesListTotalNum">
      </el-pagination>
    </div>
    <el-dialog></el-dialog>
  </div>
</template>

<script>
  import { getCloudResourceList, refetchServerList } from '@/api/resource'
  export default {
    name: 'Index',
    data() {
      return {
        loading: false,
        dialogVisible: false,
        resourcesListTotalNum: 0,
        page: 1,
        userPage: 1,
        instanceList: [],
        searchForm: {
          'page': 1
        }
      }
    },
    methods: {
      fetchCloudSeverList(params) {
        this.loading = true
        getCloudResourceList(params).then(
          res => {
            this.instanceList = res.results
            this.resourcesListTotalNum = res.count
            this.loading = false
          }
        )
      },
      refetchServer() {
        this.loading = true
        refetchServerList().then(() => {
          getCloudResourceList().then(
            res => {
              this.instanceList = res.results
              this.resourcesListTotalNum = res.count
            }
          )
          this.loading = false
        })
      },
      resolveIcon(icon_name) {
        if (icon_name === 'windows') {
          return 'Windows'
        }
        if (icon_name === 'linux') {
          return 'linux'
        }
        if (icon_name === 'running') {
          return 'running'
        }
        return icon_name
      },
      headClass() {
        return 'text-align:center;background:#eef1f6;font-weight:bold;color:#606266'
      },
      rowClass() {
        return 'text-align: center;'
      },
      handleAddServer() {
        this.dialogVisible = true
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.fetchCloudSeverList(Object.assign(this.searchForm))
      },
      handlerDeleteResource(row) {
        console.log(row)
      },
      handleEditClick(row) {
        console.log(row)
      }
    },
    created() {
      this.fetchCloudSeverList()
    }
  }
</script>

<style scoped>
.search-area {
  margin-bottom: 10px;
}
</style>
