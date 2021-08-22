<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-button size="small" type="primary" @click="handleAddResourceUser">添加用户</el-button>
    </div>

    <el-table :data="resourceUserLists" border>
      <el-table-column prop="user_name" label="用户名称"  align="center"></el-table-column>
      <el-table-column prop="user_password" label="密码" align="center"></el-table-column>
      <el-table-column prop="create_time" label="添加时间" align="center" width="200px"></el-table-column>
      <el-table-column prop="last_login_time" label="上次登录时间"  align="center" width="200px"> </el-table-column>
      <el-table-column prop="port" label="端口号" align="center"> </el-table-column>
      <el-table-column prop="is_superuser"   label="root权限"  align="center"> </el-table-column>
      <el-table-column prop="" label="操作"  align="center" width="300px">
        <template slot-scope="scope">
          <el-button size="small" @click="handleOpenNewPage(scope.row)">connect</el-button>
          <el-button size="small">编辑</el-button>
          <el-button size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用户" :visible.sync="addResourceUserFormVisible" width="600px"   append-to-body>
      <el-form ref="addResourceUserForm" :model="addResourceUserForm" label-width="80px" :rules="addRule">
        <el-form-item label="用户名称" prop="user_name">
          <el-input v-model="addResourceUserForm.user_name" maxlength="50" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input v-model="addResourceUserForm.user_password" maxlength="20" placeholder="请输入管理ip"></el-input>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="addResourceUserForm.port" maxlength="20" placeholder="请输入内网ip"></el-input>
        </el-form-item>
        <el-form-item label="root权限" prop="is_superuser">
          <el-select v-model="addResourceUserForm.is_superuser" style="width: 100%">
            <el-option
              v-for="(item, index) in isSuperUser"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="私钥" prop="private_key">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="upLoadUrl"
            :on-remove="handleRemove"
            :on-change="handleFileChange"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">ssh私钥</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addResourceUserFormVisible = false">取 消</el-button>
        <el-button type="small" size="mini"@click="handlerSubmitAddResourceUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'resourceUserList',
    props: ['resourceUserLists', 'resourceId'],
    data() {
      return {
        addResourceUserFormVisible: false,
        upLoadUrl: '',
        fileList: [],
        addResourceUserForm: {
          user_name: '',
          user_password: '',
          port: '',
          private_key: '',
          is_superuser: '',
          belong_resource: ''
        },
        isSuperUser: [
          { id: 0, name: '是' },
          { id: 1, name: '否' }
        ],
        addRule: {
          user_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          user_password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请输入端口号', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleOpenNewPage(row) {
        if (row.system_type === 'Linux') {
          const { href } = this.$router.resolve({
            path: '/resources/webssh'
          })
          const new_href = href + '?' + row.id
          window.open(new_href, '_blank', 'width=1500,height=850')
        } else {
          const { href } = this.$router.resolve({
            path: '/webssh/webvnc'
          })
          const new_href = href + '?' + row.id
          window.open(new_href, '_blank', 'width=1600,height=768')
        }
      },
      handleAddResourceUser() {
        this.addResourceUserFormVisible = true
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handleFileChange(file, fileList) {
        if (fileList.length > 0) {
          const file = fileList[fileList.length - 1]
          this.fileList = [file]
          this.addResourceForm.private_key = file.raw
        } else {
          this.fileList = []
        }
      },
      handlerSubmitAddResourceUser() {
        const formData = new FormData()
        formData.append('user_name', this.addResourceUserForm.user_name)
        formData.append('user_password', this.addResourceUserForm.user_password)
        formData.append('port', this.addResourceUserForm.port)
        formData.append('is_superuser', this.addResourceUserForm.is_superuser)
        formData.append('private_key', this.addResourceUserForm.private_key)
        formData.append('belong_resource', this.resourceId)
        this.$emit('handleAddResourceUser', formData)
      }
    }
  }
</script>

<style scoped>

</style>
