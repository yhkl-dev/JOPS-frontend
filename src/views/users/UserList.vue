<template>
  <div class="app-container" >
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            size='small'
            placeholder="搜索"
            v-model="search_user_key"
            @keyup.enter.native="searchClick">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchClick">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
            @click="addClick">
            添加用户
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      stripe
      element-loading-text="拼命加载中"
      :data="userList">
      <el-table-column
        prop="username"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        align="center">
      </el-table-column>
      <el-table-column
        prop="is_active"
        label="登录状态"
        align="center">
        <template
          slot-scope="scope">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="scope.row.is_active"
            @change="statusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="last_login"
        label="上次登陆时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
        width="400"
        align="center">
        <template
          slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="checkRoleClick(scope.row)">
            查看角色
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="chooceRoleClick(scope.row)">
            指定角色
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="changeMobileClick(scope.row)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteClick(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="pagination-container"
      v-show="total_num>=10">
      <el-pagination
        @current-change="paginationChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="page"
        :total="total_num">
      </el-pagination>
    </div>
    <el-dialog
      title="添加用户"
      :visible.sync="addUserFormVisible"
      center
      width="30%">
      <el-form
        ref="addUserForm"
        :model="addUserForm"
        label-width="70px"
        :rules="addUserRule">
        <el-form-item
          label="登陆名"
          prop="username">
          <el-input
            v-model="addUserForm.username"
            placeholder="请输入登陆名">
          </el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name">
          <el-input
            v-model="addUserForm.name"
            placeholder="请输入姓名">
          </el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password">
          <el-input
            v-model="addUserForm.password"
            type="password"
            placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone">
          <el-input
            v-model="addUserForm.phone"
            placeholder="请输入手机号">
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="submitAddClick">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="addUserFormVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看角色"
      :visible.sync="checkRoleVisible"
      center
      width="30%">
      <div class="text-center">
        <el-tag
          type="info"
          v-for="(item, index) in roleTags"
          :key="index"
          style="margin:0 10px;">
          {{ item.name }}
        </el-tag>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="checkRoleVisible = false">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="checkRoleVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="指定角色"
      width="30%"
      center
      :visible.sync="chooseRoleVisible">
      <el-form
        :model="chooseRole"
        label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="chooseRole.username"
                    disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="roles"
            multiple
            placeholder="请选择角色"
            style="width:100%">
            <el-option
              v-for="(item, index) in rolesList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
       </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="submitChooseRoleClick">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="chooseRoleVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改手机号"
      width="30%"
      center
      :visible.sync="changeMobileFormVisible">
      <el-form
        ref="changeMobileForm"
        :model="changeMobileForm"
        label-width="70px"
        :rules="addUserRule">
        <el-form-item label="登陆名">
          <el-input
            v-model="changeMobileForm.username"
            placeholder="请输入登陆名"
            disabled>
          </el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone">
          <el-input
            v-model="changeMobileForm.phone"
            placeholder="请输入手机号">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="submitChangeMobileClick">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="changeMobileFormVisible = false">
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, deleteUser, addUser, getGroupsList, getUserGroupsList, updateUserGroupsList, updateUserStatus } from '@/api/users'

export default {
  data() {
    const checkYNMobile = (rule, value, callback) => {
      if (!value || value.length === 11) {
        callback()
      } else {
        callback(new Error('请确保这个字段至少包含 11 个字符'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      userList: [],
      total_num: 0,
      page: 1,
      listLoading: true,
      loading: true,
      search_user_key: '',
      userGroupList: [],
      addUserForm: {
        username: '',
        name: '',
        password: '',
        phone: ''
      },
      addUserRule: {
        username: [
          { required: true, message: '请输入登陆名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        phone: [
          { required: false, validator: checkYNMobile, trigger: 'blur' }
        ]
      },
      rolesList: [], // 角色列表
      addUserFormVisible: false, // 增加用户弹框
      chooseRoleVisible: false, // 指定角色弹框
      chooseRole: {},
      roles: [],
      changeMobileFormVisible: false,
      changeMobileForm: {},
      checkRoleVisible: false,
      roleTags: []
    }
  },
  created() {
    this.fetchData()
    // 获取所有角色列表
    getGroupsList({ page_size: 0 }).then(res => {
      this.rolesList = res
    })
  },
  methods: {
    fetchData() {
      this.loading = true
      getUserList({ page: this.page, username: this.search_user_key }).then(res => {
        this.userList = res.results
        this.total_num = res.count
        this.loading = false
      })
    },
    searchClick() {
      this.page = 1
      this.fetchData()
    },
    paginationChange(val) {
      this.page = val
      this.fetchData()
    },
    deleteClick(row) {
      this.$confirm('此操作将删除用户 “' + row.name + '” , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
          this.$message({
            message: '删除用户 “' + row.name + '” 成功',
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
    addClick() {
      this.addUserFormVisible = true
      if (this.$refs['addUserForm'] !== undefined) {
        this.$refs['addUserForm'].resetFields()
      }
    },
    submitAddClick() {
      this.$refs['addUserForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const params = Object.assign({}, this.addUserForm)
        addUser(params).then(res => {
          this.addUserFormVisible = false
          this.fetchData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    statusChange(row) {
      const is_active = !row.is_active
      updateUserStatus(row.id, { is_active: !is_active }).then(() => {
        this.fetchData()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    chooceRoleClick(row) {
      this.roles = []
      this.chooseRoleVisible = true
      this.chooseRole = Object.assign({}, row)
      // 获取指定用户角色列表
      getUserGroupsList(row.id, { page_size: 0 }).then(res => {
        this.roles = res.map(item => {
          return item.id
        })
      })
    },
    submitChooseRoleClick() {
      if (!this.roles.length) {
        this.$message.error('请选择角色')
        return
      }
      updateUserGroupsList(this.chooseRole.id, { gid: this.roles }).then(res => {
        this.chooseRoleVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    changeMobileClick(row) {
      this.changeMobileFormVisible = true
      this.changeMobileForm = row
    },
    submitChangeMobileClick() {
      this.$refs['changeMobileForm'].validate((valid) => {
        if (!valid) {
          return
        }
        updateUserStatus(this.changeMobileForm.id, { phone: this.changeMobileForm.phone }).then(() => {
          this.changeMobileFormVisible = false
          this.fetchData()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    checkRoleClick(row) {
      this.roleTags = []
      getUserGroupsList(row.id, { page_size: 0 }).then(res => {
        this.roleTags = res
        if (this.roleTags.length > 0) {
          this.checkRoleVisible = true
        }
      })
    }
  }
}
</script>



<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
