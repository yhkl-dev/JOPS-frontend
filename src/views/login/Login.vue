<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
             class="card-box login-form">
      <el-card  class="box-card" shadow="always" style="width: 350px;height: 400px; ">
        <div slot="header" class="title">
          <i class="el-icon-s-promotion"></i>
          <span>欢迎登录</span>
        </div>
        <el-form-item prop="username" style="margin-top: 15px">
          <div>
            <i style="margin-left: 6px; margin-right: 6px" class="el-icon-s-custom"></i>
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div>
            <svg-icon style="margin-left: 6px; margin-right: 6px" icon-class="password"></svg-icon>
            <el-input name="password" :type="pwdType" @keyup.enter.native="loginClick" v-model="loginForm.password" autoComplete="on"
                      placeholder="请输入密码"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click="loginClick">
            登录
          </el-button>
        </el-form-item>
      </el-card>

    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
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
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password'
      }
    },
    methods: {
      loginClick() {
        this.$refs.loginForm.validate(valid => {
          if (!valid) {
            return
          }
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        })
      }
    }
}

</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray: black;

  .login-container {
    position: fixed;
    height: 100%;
    width:100%;
    background-color: $bg;
    background-image: url('../../assets/images/login-bg.jpg');

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset !important;
      -webkit-text-fill-color: #000000 !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 44px;
    }
    .el-input {
      display: inline-block;
      height: 45px;
      width: 90%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .title {
      font-size: 26px;
      color: black;
      margin-bottom: 15px;
      margin-top: 10px;
    }
    .login-form {
      position: absolute;
      left: 50%;
      right: 0;
      width: 500px;
      padding: 35px 35px 15px 35px;
      margin: 180px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      margin-bottom: 40px;
    }
  }
</style>

