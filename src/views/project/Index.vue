<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-button size="mini" type="primary" @click="handleAddProject">Add Project</el-button>
          <el-button size="mini" type="primary" @click="handleRefresh">Refresh</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading"
      element-loading-text="loading"
      size="mini"
      :data="productList"
      :header-cell-style="headClass"
      :row-style="rowClass">
      <el-table-column prop="project_name"  label="Name" align="center"></el-table-column>
      <el-table-column label="Project Type" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.project_type_icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="github_repo_url" label="GITHUB URL" align="center" width="200px"></el-table-column>
      <el-table-column prop="belong_group" label="Belong Group" align="center"></el-table-column>
      <el-table-column prop="belong_product" label="Product Name" align="center"></el-table-column>
      <el-table-column prop="deployment_server_dev" label="Development ENV" align="center"></el-table-column>
      <el-table-column prop="deployment_server_prod" label="Product ENV" align="center"></el-table-column>
      <el-table-column label="Operators" align="center">
        <template slot-scope="scope">
          <div v-for="(item, value) in scope.row.ops_users_list" :key="value">
            <el-tag type="info">{{ item.username }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Developers" align="center">
        <template slot-scope="scope">
          <div v-for="(item, value) in scope.row.dev_users_list" :key="value">
            <el-tag type="info">{{ item.username }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" align="center"></el-table-column>
      <el-table-column prop="update_time" label="Update Time" align="center"></el-table-column>
      <el-table-column prop="" label="OPTIONS" align="center" width="200px">
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="handleEditProject(scope.row)">Edit</el-button>
        <el-button size="small" type="text" style="color: red" @click="handlerDeleteResource(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
    <div style="margin-top: 10px"
         v-show="projectTotalNum>=10">
      <el-pagination background
                     @current-change="paginationChange"
                     layout="total, prev, pager, next, jumper"
                     :current-page.sync="page"
                     :total="projectTotalNum">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      center>
      <el-form ref="projectForm" :model="projectForm" label-width="160px" size="mini">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="Project Name: " >
              <el-input v-model="projectForm.project_name"
                        placeholder="Please input project name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="GITHUB URL: " >
              <el-input v-model="projectForm.github_repo_url"
                        placeholder="Please input github repo url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Project Type: ">
              <el-select v-model="projectForm.project_type"
                         clearable
                         style="width:100%"
                         placeholder="Please choose project type">
                <el-option v-for="(item,value) in projectTypeList"
                           :key="value"
                           :label="item.type_name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Response Group: ">
              <el-select v-model="projectForm.belong_group_id"
                         style="width:100%"
                         placeholder="Please choose role"
                         clearable
                         width="100%">
                <el-option v-for="(item,value) in groupList"
                           :key="value"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Name: ">
              <el-select v-model="projectForm.belong_product_id"
                         style="width:100%"
                         placeholder="Please choose role"
                         clearable
                         width="100%">
                <el-option v-for="(item,value) in productList"
                           :key="value"
                           :label="item.product_name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Development Server: ">
              <el-select v-model="projectForm.deployment_server_dev_id"
                         clearable
                         style="width:100%"
                         placeholder="Please select server for develop env">
                <el-option v-for="(item, value) in instanceList"
                           :key="value"
                           :label="item.IpAddress"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Product Server: ">
              <el-select v-model="projectForm.deployment_server_prod_id"
                         clearable
                         style="width:100%"
                         placeholder="Please select server for product env">
                <el-option v-for="(item, value) in instanceList"
                           :key="value"
                           :label="item.IpAddress"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Develop User: ">
              <el-select v-model="projectForm.dev_users"
                         clearable
                         multiple
                         style="width:100%"
                         placeholder="Please select develop users">
                <el-option v-for="(item, value) in userList"
                           :key="value"
                           :label="item.username"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Operation User: ">
              <el-select v-model="projectForm.ops_users"
                         clearable
                         multiple
                         style="width:100%"
                         placeholder="Please select operate user">
                <el-option v-for="(item, value) in userList"
                           :key="value"
                           :label="item.username"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Description: " >
              <el-input v-model="projectForm.description"
                        :rows="2"
                        placeholder="Please input description, less than 200 characters"
                        type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleSaveProject">CONFIRM</el-button>
        <el-button size="mini" @click="dialogVisible = false">CANCEL</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getProjectList, getProjectTypeList, addProject, updateProject } from '@/api/project'
  import { getCloudResourceList } from '@/api/resource'
  import { getGroupsList, getUserList } from '@/api/users'
  import { getProduct } from '@/api/product'

  export default {
    name: 'Project',
    data() {
      return {
        loading: false,
        dialogVisible: false,
        dialogTitle: '',
        page: 1,
        projectTotalNum: 0,
        projectList: [],
        projectTypeList: [],
        instanceList: [],
        groupList: [],
        userList: [],
        productList: [],
        projectForm: {
          id: '',
          project_name: '',
          github_repo_url: '',
          belong_group_id: '',
          project_type_id: '',
          belong_product_id: '',
          deployment_server_dev_id: '',
          deployment_server_prod_id: '',
          ops_users: [],
          dev_users: [],
          description: ''
        },
        searchForm: {
          page: 1
        }
      }
    },
    methods: {
      fetchProjectList(params) {
        this.loading = true
        getProjectList(params).then(res => {
          this.productList = res.results
          this.projectTotalNum = res.counts
          this.loading = false
        })
      },
      fetchProjectTypeList(params) {
        getProjectTypeList(params).then(res => {
          this.projectTypeList = res.results
        })
      },
      fetchGroupList(params) {
        getGroupsList(params).then(res => {
          this.groupList = res.results
        })
      },
      fetchCloudSeverList(params) {
        getCloudResourceList(params).then(
          res => {
            this.instanceList = res.results
          }
        )
      },
      fetchUserList(params) {
        getUserList(params).then(
          res => {
            this.userList = res.results
          }
        )
      },
      fetchProductList(params) {
        getProduct(params).then(res => {
          this.productList = res.results
        })
      },
      handleRefresh() {
        this.fetchProjectList()
      },
      headClass() {
        return 'text-align:center;background:#eef1f6;font-weight:bold;color:#606266'
      },
      rowClass() {
        return 'text-align:center;'
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.fetchProjectList(Object.assign(this.searchForm))
      },
      handleAddProject() {
        this.dialogVisible = true
        this.dialogTitle = 'Create'
        if (this.$ref['projectForm'] !== undefined) {
          this.$ref['projectForm'].resetFields()
        }
      },
      handleEditProject(row) {
        this.dialogVisible = true
        this.dialogTitle = 'Update'
        const { id, project_name, belong_group_id, belong_product_id, belong_product, project_type, project_type_id, deployment_server_dev, deployment_server_dev_id, deployment_server_prod, deployment_server_prod_id, github_repo_url, ops_users, dev_users, description } = row
        this.projectForm = { id, project_name, belong_group_id, belong_product_id, belong_product, project_type, project_type_id, deployment_server_dev, deployment_server_dev_id, deployment_server_prod, deployment_server_prod_id, github_repo_url, ops_users, dev_users, description }
      },
      handleSaveProject() {
        if (this.dialogTitle === 'Create') {
          // delete this.projectForm.id
          this.projectForm.belong_group = this.projectForm.belong_group_id
          this.projectForm.belong_product = this.projectForm.belong_product_id
          this.projectForm.deployment_server_dev = this.projectForm.deployment_server_dev_id
          this.projectForm.deployment_server_prod = this.projectForm.deployment_server_prod_id
          addProject(this.projectForm).then(() => {
            this.$message({
              message: 'ADD SUCCESS',
              type: 'success'
            })
            this.fetchProjectList()
            this.dialogVisible = false
          })
        }
        if (this.dialogTitle === 'Update') {
          this.projectForm.project_type = this.projectForm.project_type_id
          this.projectForm.belong_group = this.projectForm.belong_group_id
          this.projectForm.deployment_server_dev = this.projectForm.deployment_server_dev_id
          this.projectForm.deployment_server_prod = this.projectForm.deployment_server_prod_id
          updateProject(this.projectForm.id, this.projectForm).then(() => {
            this.$message({
              message: 'ADD SUCCESS',
              type: 'success'
            })
            this.fetchProjectList()
            this.dialogVisible = false
          })
        }
      }
    },
    created() {
      this.fetchProjectList()
      this.fetchProjectTypeList()
      this.fetchGroupList()
      this.fetchCloudSeverList()
      this.fetchUserList()
      this.fetchProductList()
    }
  }
</script>

<style scoped>
  .search-class {
    margin-bottom: 10px;
  }
</style>
