<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <user-card :user="user" />
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab" tab-position="top">
            <el-tab-pane label="消息列表" name="activity">
              <user-messages></user-messages>
            </el-tab-pane>
            <el-tab-pane label="账号管理" name="account">
              <account ></account>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import UserMessages from './components/UserMessages'

export default {
  name: 'Profile',
  components: { UserCard, Account, UserMessages },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name
      }
    },
    submitChangePassForm(data) {

    }
  }
}
</script>
