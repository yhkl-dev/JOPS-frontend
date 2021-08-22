<template>
  <div class="app-container">
    <el-collapse v-model="activeNames" @change="handleChange" >
      <el-collapse-item title="基础信息" name="1">
        <el-row>
          <el-col span="2">
            <table>
              <tr><td>工单标题</td></tr>
              <tr><td>工单状态</td></tr>
              <tr><td>当前执行人</td></tr>
              <tr><td>工单ID</td></tr>
            </table>
          </el-col>
          <el-col span="6">
            <table>
              <tr><td>{{ workOrderDetail.order_title }}</td></tr>
              <tr><td>{{ workOrderDetail.order_status }}</td></tr>
              <tr><td>{{ workOrderDetail.current_exec_user.username }}</td></tr>
              <tr><td>{{ workOrderDetail.order_task_id }}</td></tr>
            </table>
          </el-col>
          <el-col span="2">
            <table>
              <tr><td>创建时间</td></tr>
              <tr><td>更新时间</td></tr>
              <tr><td>当前审核人</td></tr>
            </table>
          </el-col>
          <el-col span="4">
            <table>
              <tr><td>{{ workOrderDetail.create_time }}</td></tr>
              <tr><td>{{ workOrderDetail.update_time }}</td></tr>
              <tr><td>{{ workOrderDetail.current_audit_user.username }}</td></tr>
            </table>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="工单需求" name="2">
        <div>{{  workOrderDetail.order_purpose }}</div>
      </el-collapse-item>
      <el-collapse-item title="工单结果" name="2">
        <div>{{  workOrderDetail.order_result }}</div>
      </el-collapse-item>
      <el-collapse-item  title="审核信息" name="3" >
        <el-steps finish-status="success" process-status="wait"  :space="200" :active="getElementIndex(workOrderDetail.audit_flow, workOrderDetail.current_audit_flow)" >
            <el-step icon="el-icon-user-solid" :title="item.exec_user" v-for="item,index in workOrderDetail.audit_flow" :key="index" ></el-step>
        </el-steps>
      </el-collapse-item>
      <el-collapse-item title="执行信息" name="3">
        <el-steps finish-status="success" process-status="wait" :space="200" :active="getElementIndex(workOrderDetail.exec_flow, workOrderDetail.current_exec_flow)" >
          <el-step icon="el-icon-user-solid" :title="item.exec_user" v-for="item,index in workOrderDetail.exec_flow" :key="index"></el-step>
        </el-steps>
      </el-collapse-item>
      <el-collapse-item title="操作记录" name="4">
          <div v-for="item,index in workOrderDetail.operation_records" :key="index">
            <el-row>
              <el-col span="6">{{ item.create_time }}</el-col>
              <el-col span="3">{{ item.ops_user }}</el-col>
              <el-col span="4">{{ item.ops_status }}</el-col>
            </el-row>
          </div>
      </el-collapse-item>
      <el-collapse-item title="评论回复" name="5">
        <div v-for="item,index in workOrderDetail.operation_replys" :key="index">
          <el-row>
            <el-col span="6">{{ item.create_time }}</el-col>
            <el-col span="3">{{ item.ops_user }}</el-col>
            <el-col span="4">{{ item.ops_reply_content }}</el-col>
          </el-row>
        </div>
        <div style="margin-top: 20px;">
          <el-row>
           <el-input clearable size="small" placeholder="请输入内容" v-model="replyContent" style="width: 80%"></el-input>
            <el-button type="primary" size="small" @click="handleReplyWorkOrder(workOrderDetail.id)">发送</el-button>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: 'workOrderDetail',
    props: ['workOrderDetail'],
    data: function() {
      return {
        // workOrderDetail: null,
        activeNames: ['1', '2', '3'],
        replyContent: '',
        replyWorkOrderTaskForm: {
          ops_status: 15,
          ops_reply_content: '',
          work_order: ''
        }
      }
    },
    methods: {
      handleChange(val) {},
      getElementIndex(flow_list, current_flow) {
        const new_flow_list = []
        for (var i = 0; i < flow_list.length; i++) {
          new_flow_list.push(flow_list[i].exec_user)
        }
        return new_flow_list.indexOf(current_flow.exec_user) + 1
      },
      handleReplyWorkOrder(id) {
        this.replyWorkOrderTaskForm.ops_reply_content = this.replyContent
        this.replyWorkOrderTaskForm.work_order = id
        this.$emit('replyWorkOrderTaskForm', this.replyWorkOrderTaskForm)
        this.replyContent = ''
      }
    }
  }
</script>

<style scoped>
</style>
