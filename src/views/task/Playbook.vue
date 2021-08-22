<template>
    <div style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
      <el-form ref="form" :model="TaskData" label-width="100px">
        <el-form-item label="任务名称">
          <el-input  placeholder="任务名称" v-model="TaskData.name"></el-input>
        </el-form-item>
        <el-form-item label="yaml文件名称">
          <el-input  placeholder="yaml文件名称"v-model="TaskData.playbook_name"></el-input>
        </el-form-item>
        <el-form-item label="yaml文件内容">
          <el-input placeholder="yaml文件格式" type="textarea"  style="height: 50px;width: 600px" resize="none" rows="20" v-model="TaskData.playbook"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="buttonPosition" type="primary" @click="handleSubmitAdd">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>

</template>

<script>
  import { createTask } from '@/api/tasks'
  export default {
    name: 'Playbook',
    data() {
      return {
        TaskData: {
          name: '',
          playbook_name: '',
          playbook: ''
        }
      }
    },
    methods: {
      handleCreateTask(formData) {
        const newFormData = new FormData()
        newFormData.append('name', this.TaskData.name)
        const yml = this.TaskData.playbook
        const blob = new Blob([yml])
        newFormData.append('playbook', blob, this.TaskData.playbook_name)
        createTask(newFormData).then(res => {
          this.$message({
            message: '创建任务成功',
            type: 'success'
          })
          this.handleCancelAdd()
          this.fetchData()
        })
      },
      handleSubmitAdd(data) {
        this.handleCreateTask(data)
        this.$router.push('/task/task_list')
      }
    }

  }
</script>

<style lang="scss" scoped>
  .el-input {
    width: 600px;
  }
  .buttonPosition {
    margin-top: 380px;
  }


</style>
