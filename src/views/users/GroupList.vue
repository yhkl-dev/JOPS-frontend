<template>
  <div class="app-container" >
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            size='small'
            placeholder="搜索"
            v-model="search_role"
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
            size='small'
            type="primary"
            @click="addRoleClick">
            添加角色
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="groupList">
      <el-table-column
        prop="name"
        label="角色名"
        align="center">
      </el-table-column>
      <el-table-column
        label="成员管理"
        align="center">
        <template
          slot-scope="scope">
          <el-button
            @click.native.prevent="groupMemberClick(scope.row.id)"
            type="text"
            size="small">
            {{'成员列表（' + scope.row.member+ '）人'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
              prop=""
              label="api接口权限"
              align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="checkPermissionClick(scope.row.id)">
            查看
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="changePermissionClick(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
              prop=""
              label="前端权限"
              align="center">
        <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showGroupMenus(scope.row.id)">
              查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="changeGroupMenus(scope.row.id)">
              修改</el-button>
        </template>
      </el-table-column>
      <el-table-column
              prop=""
              label="操作"
              align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="deleteGroupClick(scope.row)">
            删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container"
         v-show="total_num>=10">
      <el-pagination
        @current-change="paginationChange"
        layout="total, prev, pager, next, jumper"
        :current-page.sync="page"
        :total="total_num">
      </el-pagination>
    </div>
    <el-dialog
      title="添加角色"
      center
      width="30%"
      :visible.sync="addRoleVisible">
      <el-form
        ref="addRoleForm"
        :model="addRoleForm"
        label-width="70px"
        :rules="addRoleRule">
        <el-form-item
          label="角色名"
          prop="name">
          <el-input
            size="small"
            v-model="addRoleForm.name"
            placeholder="请输入角色名">
          </el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="submitAddRoleClick">
          确 定</el-button>
        <el-button
          size="small"
          @click="addRoleVisible = false">
          取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="成员列表"
      center
      :visible.sync="groupMemberListVisible">
      <group-member-table
        v-bind:groupMemberSearchKey="groupMemberSearchKey"
        v-bind:groupMemberListData="groupMemberListData"
        v-bind:groupMemberLoading="groupMemberLoading"
        v-bind:groupMemberPage="groupMemberPage"
        v-bind:groupMemberTotal="groupMemberTotal"
        @groupMemberSearchClick="groupMemberSearchClick"
        @groupMemberDeleteClick="groupMemberDeleteClick"
        @groupMemberPaginationChange="groupMemberPaginationChange">
      </group-member-table>
    </el-dialog>
    <el-dialog
      title="查看权限"
      center
      :visible.sync="checkPermissionVisible">
      <permission-table
        v-bind:permissionloading="permissionloading"
        v-bind:permissionList="permissionList">
      </permission-table>
    </el-dialog>
    <el-dialog
      title="修改权限"
      center
      width="55%"
      :visible.sync="modifyGroupPermissionVisible" >
      <permission-change-table
        v-bind:modify-group-permission-loading="modifyGroupPermissionLoading"
        v-bind:modify-group-permission-search-key="modifyGroupPermissionSearchKey"
        v-bind:modify-group-permission-total="modifyGroupPermissionTotal"
        v-bind:modifyGroupPermissionPage="modifyGroupPermissionPage"
        v-bind:modify-group-permission-data="modifyGroupPermissionData"
        @modifyGroupPermissionSearchClick="modifyGroupPermissionSearchClick"
        @modifyGroupPermissionChangeStatus="modifyGroupPermissionChangeStatus"
        @modifyGroupPermissionPaginationChange="modifyGroupPermissionPaginationChange">
      </permission-change-table>
    </el-dialog>
    <el-dialog
      title="查看前端菜单"
      center
      :visible.sync="groupMenuVisible"
      width="400px">
      <el-tree
        :data="menuData"
        :show-checkbox="menuFlag"
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :default-checked-keys="defaultCheckedKeys"
        :render-content="renderContent">
      </el-tree>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          size="small"
          type="primary"
          @click="submitGroupMenus">
          确 定
        </el-button>
        <el-button
          size="small"
          @click="groupMenuVisible = false">
          取 消
        </el-button>
      </span>
    </el-dialog>
    </div>
</template>

<script>
import { getGroupsList, addRole,
  getGroupPermissionsList, deleteGroup,
  getGroupMenuList, updateGroupMenu,
  getGroupMembers, deleteGroupMember,
  deleteGroupPermissions, updateGroupPermissions } from '@/api/users'
import GroupMemberTable from './groups/GroupMemberTable'
import PermissionTable from './groups/PermissionTable'
import PermissionChangeTable from './groups/PermissionChangeTable'

export default {
  components: { PermissionChangeTable, GroupMemberTable, PermissionTable },
  data() {
    return {
      groupList: [],
      total_num: 0,
      page: 1,
      loading: false,
      search_role: '',
      checkPermissionVisible: false,
      permissionloading: false,
      permissionList: [],
      addRoleVisible: false,
      addRoleForm: {
        name: ''
      },
      addRoleRule: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      groupMemberListVisible: false,
      groupMemberListData: [],
      groupMemberPage: 1,
      groupMemberLoading: false,
      groupMemberGID: 0,
      groupMemberSearchKey: '',
      groupMemberTotal: 0,
      modifyGroupPermissionVisible: false,
      modifyGroupPermissionSearchKey: '',
      modifyGroupPermissionPage: 1,
      modifyGroupPermissionLoading: false,
      modifyGroupPermissionGID: 0,
      modifyGroupPermissionData: [],
      modifyGroupPermissionTotal: 0,
      menuFlag: false,
      groupMenuVisible: false,
      menuData: [],
      defaultCheckedKeys: [],
      menuModifyData: {
        gid: 0, // 当前修改的组id
        mid: [] //
      }
    }
  },
  created() {
    this.fetchGroupData()
  },
  methods: {
    fetchGroupData() {
      this.loading = true
      getGroupsList({ page: this.page, name: this.search_role }).then(res => {
        this.groupList = res.results
        this.total_num = res.count
        this.loading = false
      })
    },
    searchClick() {
      this.page = 1
      this.fetchGroupData()
    },
    paginationChange(val) {
      this.page = val
      this.fetchGroupData()
    },
    checkPermissionClick(id) {
      this.checkPermissionVisible = true
      this.permissionloading = true
      this.permissionList = []
      getGroupPermissionsList(id, { page_size: 0 }).then(res => {
        this.permissionList = res
        this.permissionloading = false
      })
    },
    changePermissionClick(row) {
      this.modifyGroupPermissionGID = row.id
      this.modifyGroupPermissionVisible = true
      this.modifyGroupPermissionData = []
      this.modifyGroupPermissionTotal = 0
      this.fetchModifyGroupPermissionData()
    },
    addRoleClick() {
      this.addRoleVisible = true
      if (this.$refs['addRoleForm'] !== undefined) {
        this.$refs['addRoleForm'].resetFields()
      }
    },
    submitAddRoleClick() {
      this.$refs['addRoleForm'].validate((valid) => {
        if (!valid) {
          return
        }
        addRole({ name: this.addRoleForm.name }).then(res => {
          this.addRoleVisible = false
          this.fetchGroupData()
        })
      })
    },
    deleteGroupClick(row) {
      this.$confirm('此操作将删除用户 “' + row.name + '” , 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id).then(res => {
          this.$message({
            message: '删除用户 “' + row.name + '” 成功',
            type: 'success'
          })
          this.fetchGroupData()
        })
      }).catch(() => { })
    },
    groupMemberClick(gid) {
      this.groupMemberGID = gid
      this.groupMemberListVisible = true
      this.fetchGroupMemberList()
    },
    renderContent(h, { node, data, store }) {
      // 用于格式化tree
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            { data.show ? '显示' : '隐藏' }
          </span>
        </span>)
    },
    showGroupMenus(gid) {
      this.menuData = []
      this.menuFlag = false
      this.groupMenuVisible = true
      getGroupMenuList(gid).then(res => {
        this.menuData = res
      })
    },
    changeGroupMenus(gid) {
      this.menuData = []
      this.menuFlag = true
      this.groupMenuVisible = true
      this.menuModifyData.gid = gid
      this.defaultCheckedKeys = []
      getGroupMenuList(gid, { modify: true }).then(res => {
        this.menuData = res.data
        this.defaultCheckedKeys = res.permissions
      })
    },
    submitGroupMenus() {
      if (!this.menuFlag) {
        this.groupMenuVisible = false
        return
      }
      updateGroupMenu(this.menuModifyData.gid, { mid: this.$refs.tree.getCheckedKeys() }).then(res => {
        this.groupMenuVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    fetchGroupMemberList() {
      console.log('fetchGroupMemberList')
      this.groupMemberLoading = true
      getGroupMembers(this.groupMemberGID, { page: this.groupMemberPage, username: this.groupMemberSearchKey }).then(res => {
        this.groupMemberListData = res.results
        this.groupMemberTotal = res.count
        this.groupMemberLoading = false
      })
    },
    groupMemberSearchClick(data) {
      this.groupMemberPage = 1
      this.groupMemberSearchKey = data
      this.fetchGroupMemberList()
    },
    groupMemberPaginationChange(val) {
      this.groupMemberPage = val
      this.fetchGroupMemberList()
    },
    groupMemberDeleteClick(row) {
      this.$confirm('此操作将删除组成员 “' + row.name + '” , 是否继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteGroupMember(this.groupMemberGID, { uid: row.id }).then(res => {
          this.$message({
            message: '删除组成员 “' + row.name + '” 成功',
            type: 'success'
          })
          this.fetchGroupMemberList()
          this.fetchGroupData()
        })
      }).catch(() => { })
    },
    fetchModifyGroupPermissionData() {
      this.modifyGroupPermissionLoading = true
      getGroupPermissionsList(this.modifyGroupPermissionGID, { page: this.modifyGroupPermissionPage, page_size: 6, name: this.modifyGroupPermissionSearchKey, modify: true }).then(res => {
        this.modifyGroupPermissionData = res.results
        this.modifyGroupPermissionTotal = res.count
        this.modifyGroupPermissionLoading = false
      })
    },
    modifyGroupPermissionSearchClick(val) {
      this.modifyGroupPermissionSearchKey = val
      this.modifyGroupPermissionPage = 1
      this.fetchModifyGroupPermissionData()
    },
    modifyGroupPermissionChangeStatus(row) {
      row.status = !row.status
      if (row.status) {
        deleteGroupPermissions(this.modifyGroupPermissionGID, { pid: row.id }).then(res => {
          row.status = !row.status
          this.$message.success('删除权限成功！')
        })
      } else {
        updateGroupPermissions(this.modifyGroupPermissionGID, { pid: row.id }).then(res => {
          row.status = !row.status
          this.$message.success('添加权限成功！')
        })
      }
    },
    modifyGroupPermissionPaginationChange(val) {
      this.modifyGroupPermissionPage = val
      this.fetchModifyGroupPermissionData()
    }
  }
}
</script>

<style scoped>
</style>
