<template>
  <div>
    <el-form :model="changePassForm"
             status-icon
             :rules="rules"
             ref="changePassForm"
             label-width="100px">
      <el-form-item label="密码"
                    prop="pass">
        <el-input type="password"
                  size="small"
                  v-model="changePassForm.pass"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="checkPass">
        <el-input type="password"
                  size="small"
                  v-model="changePassForm.checkPass"
                  autocomplete="off">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="small"
                   @click="submitChangePassForm">提交</el-button>
        <el-button @click="resetForm"
                   size="small">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getInfo } from '@/api/login'
  import { updateUser } from '@/api/users'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Account',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.changePassForm.checkPass !== '') {
            this.$refs.changePassForm.validateField('checkPass')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.changePassForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userInfo: {},
        token: getToken(),
        changePassForm: {
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      fetchData() {
        getInfo(self.token).then(
          res => {
            this.userInfo = res
          })
      },
      submitChangePassForm() {
        this.$refs['changePassForm'].validate((valid) => {
          if (valid) {
            const data = {
              id: this.userInfo.id,
              password: this.changePassForm.pass,
              username: this.userInfo.username,
              name: this.userInfo.name
            }
            updateUser(this.userInfo.id, data).then(() => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })
          } else {
            console.log('err')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style scoped>

</style>
