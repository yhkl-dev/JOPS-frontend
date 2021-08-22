<template>
  <div class="app-container">
<!--    <div style="margin-top: 20px; margin-bottom: 20px">-->
    <div class="filter-container">
      <el-row>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-search"
                   @click="handlerSearchClick">搜 索</el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-plus"
                   @click="handleAddResource">添加资源</el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-menu"
                   @click="handleCheckResourceType">资源类型</el-button>
        <el-button type="primary"
                   size="small"
                   icon="el-icon-download">导出</el-button>
      </el-row>
    </div>
    <el-form ref="searchForm"
             :model="searchForm"
             :inline="true"
             v-show="searchFormVisible">
      <el-form-item>
        <el-select v-model="searchForm.service_id"
                   style="width: 150px"
                   size="small">
          <el-option v-for="(item, index) in searchServiceIdList"
                     :key="index"
                     :label="item.service_name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.server_purpose"
                   style="width: 150px"
                   size="small">
          <el-option v-for="(item, index) in searchServerPurposeList"
                     :key="index"
                     :label="item.service_name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.resource_type"
                   style="width: 150px"
                   size="small">
          <el-option v-for="(item, index) in resourceTypeList"
                     :key="index"
                     :label="item.resource_name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.resource_name"
                  placeholder="请输入主机名或IP地址"
                  style="width: 300px"
                  size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   @click="handlerSearch()">搜 索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" element-loading-text="拼命加载中" :data="resourceList"  style="width: 100%">
      <el-table-column prop="resource_name"  label="资源名称"></el-table-column>
      <el-table-column prop="service.name"   label="业务线" align="center" width="150px"></el-table-column>
      <el-table-column prop="server_purpose.name" label="产品线" align="center" width="300px"></el-table-column>
      <el-table-column label="资源类型" width="80px">
        <template slot-scope="scope">
          <div>
            <svg-icon :icon-class="scope.row.type_icon"></svg-icon>
            {{ scope.row.type_name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="belong_user" label="所属用户"  width="80px" align="center"></el-table-column>
      <el-table-column prop="manage_ip" label="管理IP"  width="120px"   align="center"></el-table-column>
      <el-table-column prop="inner_ip" label="内网ip"  width="120px"  align="center"></el-table-column>
      <el-table-column prop="description" label="描述"  width="200px" align="center"></el-table-column>
      <el-table-column prop="add_time" label="添加时间"  width="160px"  align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-user" circle @click="showResourceUser(scope.row)"></el-button>
          <el-button size="small" type="success" icon="el-icon-edit" circle @click="handleEditClick(scope.row)"></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" circle @click="handlerDeleteResource(scope.row)"></el-button>
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
    <el-dialog title="添加资源"  :visible.sync="addFormVisible" width="600px"  :before-close="handleClose">
      <el-form ref="addResourceForm"  :model="addResourceForm"   label-width="80px"   :rules="addRule">
        <el-form-item label="资源名称"  prop="resource_name">
          <el-input v-model="addResourceForm.resource_name" max_length="200"  placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源类型"  prop="resource_type">
          <el-select class="select"  v-model="addResourceForm.resource_type" placeholder="资源类型" style="width: 100%">
            <el-option v-for="(item, index) in resourceTypeList"
                       :key="index"
                       :label="item.type_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理ip"  prop="manage_ip">
          <el-input v-model="addResourceForm.manage_ip"  maxlength="20"  placeholder="请输入管理ip"></el-input>
        </el-form-item>
        <el-form-item label="内网ip"
                      prop="inner_ip">
          <el-input v-model="addResourceForm.inner_ip"
                    maxlength="20"
                    placeholder="请输入内网ip"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="description">
          <el-input v-model="addResourceForm.description"
                    maxlength="20"
                    placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="业务线"
                      prop="service">
          <el-select v-model="addResourceForm.service"
                     @change="addService"
                     style="width: 100%">
            <el-option v-for="(item, index) in serviceIdList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品线" prop="server_purpose">
          <el-select v-model="addResourceForm.server_purpose"   style="width: 100%">
            <el-option v-for="(item, index) in serverPurposeList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="addFormVisible = false">取 消</el-button>
        <el-button type="small"
                   size="mini"
                   @click="submitAddResourceForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改资源"  :visible.sync="changeResourceVisible" width="600px">
      <el-form ref="changeResourceForm" :model="changeResourceForm" label-width="70px">
        <el-form-item label="主机名称"  prop="resource_name">
          <el-input v-model="changeResourceForm.resource_name"  :disabled="true"  placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resource_type">
          <el-select class="select"  disabled v-model="changeResourceForm.resource_type"  placeholder="资源类型" style="width: 100%">
            <el-option v-for="(item, index) in resourceTypeList"
                       :key="index"
                       :label="item.type_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理ip"  prop="manage_ip">
          <el-input v-model="changeResourceForm.manage_ip"  :disabled="true" placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="内网ip"   prop="inner_ip">
          <el-input v-model="changeResourceForm.inner_ip" placeholder="请输入内网ip"></el-input>
        </el-form-item>
        <el-form-item label="业务线" prop="service">
          <el-select v-model="changeResourceForm.service"  @change="changeService"  style="width: 100%">
            <el-option v-for="(item, index) in serviceIdList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品线" prop="server_purpose">
          <el-select v-model="changeResourceForm.server_purpose"  style="width: 100%">
            <el-option v-for="(item, index) in serverPurposeList"
                       :key="index"
                       :label="item.service_name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="changeResourceForm.description"   placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"  @click="changeResourceVisible = false">取 消</el-button>
        <el-button size="small"  type="primary" @click="submitChangeServerClick">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="资源用户"  :visible.sync="resourceUserDialogVisible" width="1200px" >
      <resource-user-list v-bind:resourceUserLists="resourceUserLists"
                          v-bind:resourceId="resourceId"
                          @handleAddResourceUser="handleAddResourceUser">
      </resource-user-list>
    </el-dialog>
    <el-dialog title='资源类型'
               :visible.sync="resourceTypeListVisible"
               width="400px">
      <resource-type v-bind:resourceTypeList="resourceTypeList"></resource-type>
    </el-dialog>
  </div>
</template>

<script>
import { getResourceList, getProductLevel, getResourceTypeList, addResource, updateResource, deleteResoure, addResourceUser } from '@/api/resource'
import ResourceType from './resourceManage/resourceType'
import resourceUserList from './resourceManage/resourceUserList'

export default {
  name: 'ServerResource',
  components: { ResourceType, resourceUserList },
  data() {
    return {
      resourceList: [],
      resourceUserLists: [],
      resourceTypeList: [],
      resourceId: '',
      upLoadUrl: '',
      loading: false,
      ResourcesListTotalNum: 0,
      page: 1,
      userPage: 1,
      state: 0,
      searchForm: {
        resource_name: '',
        manage_ip: '',
        resource_type: '',
        service_id: '',
        server_purpose: '',
        'page': 1
      },
      serviceIdList: [],
      fileList: [],
      searchFormVisible: false,
      resourceTypeListVisible: false,
      addFormVisible: false,
      changeResourceVisible: false,
      resourceUserDialogVisible: false,
      searchServerPurposeList: [{ id: '', service_name: '所有产品线' }],
      serverPurposeList: [],
      addResourceForm: {
        resource_name: '',
        manage_ip: '',
        resource_type: '',
        inner_ip: '',
        description: '',
        service: '',
        server_purpose: ''
      },
      changeResourceForm: {
        id: '',
        resource_name: '',
        resource_type: '',
        manage_ip: '',
        inner_ip: '',
        description: '',
        service: '',
        server_purpose: ''
      },
      addRule: {
        resource_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        manage_ip: [
          { required: true, message: '请输入管理ip', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    searchServiceIdList() {
      return [{ id: '', service_name: '所有业务线' }].concat(this.serviceIdList)
    }
  },
  watch: {
    state() {
      getProductLevel({ pid: 0, page_size: 0 }).then(res => {
        this.serviceIdList = res.map(item => {
          return { id: item.id, service_name: item.service_name }
        })
      })
      this.fetchData()
    },
    'searchForm.service_id'(val) {
      this.searchServerPurposeList = [{ id: '', service_name: '所有产品线' }]
      if (!val) {
        this.searchForm.server_purpose = ''
        return
      }
      getProductLevel({ pid: val, page_size: 0 }).then(res => {
        this.searchServerPurposeList = this.searchServerPurposeList.concat(res.map(item => {
          return { id: item.id, service_name: item.service_name }
        }))
      })
    },
    'addResourceForm.service'(val) {
      if (!val) {
        this.addResourceForm.server_purpose = ''
        return
      }
      getProductLevel({ pid: val, page_size: 0 }).then(res => {
        this.serverPurposeList = res.map(item => {
          return { id: item.id, service_name: item.service_name }
        })
      })
    },
    'changeResourceForm.service'(val) {
      if (!val) {
        this.changeResourceForm.server_purpose = ''
        return
      }
      getProductLevel({ pid: val, page_size: 0 }).then(res => {
        this.serverPurposeList = res.map(item => {
          return { id: item.id, service_name: item.service_name }
        })
      })
    }
  },
  methods: {
    fetchData(params) {
      this.loading = true
      getResourceList(params).then(
        res => {
          this.resourceList = res.results
          this.ResourcesListTotalNum = res.count
          this.loading = false
        }
      )
      getResourceTypeList().then(
        res => {
          this.resourceTypeList = res.results
        }
      )
    },
    paginationChange(val) {
      this.searchForm.page = val
      this.fetchData(Object.assign(this.searchForm))
    },
    handlerSearchClick() {
      this.searchFormVisible = this.searchFormVisible !== true
    },
    handlerSearch() {
      this.fetchData(Object.assign(this.searchForm))
    },
    handleAddResource() {
      this.addFormVisible = true
      if (this.$refs['addForm'] !== undefined) {
        this.$refs['addForm'].resetFields()
      }
    },
    addService() {
      this.addResourceForm.server_purpose = ''
    },
    changeService() {
      this.changeResourceForm.server_purpose = ''
    },
    showResourceUser(row) {
      this.resourceUserDialogVisible = true
      this.resourceUserLists = row.resource_user_info
      this.resourceId = row.id
    },
    submitAddResourceForm() {
      addResource(this.addResourceForm).then(res => {
        this.addFormVisible = false
        this.fetchData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleEditClick(row) {
      this.changeResourceVisible = true
      if (this.$refs['changeResourceForm'] !== undefined) {
        this.$refs['changeResourceForm'].resetFields()
      }
      const { id, resource_name, resource_type, manage_ip, description, inner_ip } = row
      const { service, server_purpose } = { service: row.service.id, server_purpose: row.server_purpose.id }
      this.changeResourceForm = { id, resource_name, resource_type, manage_ip, inner_ip, description, service, server_purpose }
    },
    submitChangeServerClick() {
      this.$refs['changeResourceForm'].validate((valid) => {
        if (!valid) {
          return
        }
        updateResource(this.changeResourceForm.id, this.changeResourceForm).then(res => {
          this.changeResourceVisible = false
          this.fetchData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    handlerDeleteResource(row) {
      this.$confirm('此操作将删除 [ ' + row.resource_name + ' ] 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResoure(row.id).then(() => {
          this.$message({
            message: '删除资源成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          message: '操作失败',
          type: 'error'
        })
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleCheckResourceType() {
      this.resourceTypeListVisible = true
    },
    handleAddResourceUser(formData) {
      addResourceUser(formData).then(res => {
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.resourceUserDialogVisible = false
        this.fetchData()
      })
    }
  },
  created() {
    this.state = 1
  }
}
</script>

<style scoped>
</style>
