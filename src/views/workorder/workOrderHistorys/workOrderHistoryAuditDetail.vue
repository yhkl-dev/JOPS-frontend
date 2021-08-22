<template>
  <div class="components-container">
    <el-collapse  v-model="activeNames" @change="handleChange" >
      <el-collapse-item title="基础信息" name="1">
        <el-row>
          <el-col :span="2">
            <table>
              <tr><td>工单标题</td></tr>
              <tr><td>工单状态</td></tr>
              <tr><td>项目名称</td></tr>
              <tr><td>当前审核人</td></tr>
              <tr><td>当前执行人</td></tr>
              <tr><td>附件</td></tr>
              <tr v-for="item in workOrderDetail.extra_fields"><td>{{ item.value_name }}</td></tr>
            </table>
          </el-col>
          <el-col :span="6">
            <table>
              <tr><td>{{ workOrderDetail.order_title }}</td></tr>
              <tr><td>{{ workOrderDetail.status_name }}</td></tr>
              <tr><td>{{ workOrderDetail.order_project_name }}</td></tr>
              <tr><td>{{ workOrderDetail.current_audit_user || '暂无' }}</td></tr>
              <tr><td>{{ workOrderDetail.current_exec_user || '暂无' }}</td></tr>
              <tr><td>
                <div v-if="workOrderDetail.download_url !== null">
                  <el-button
                    size="mini"
                    type="text"
                    @click="downloadAttachment(workOrderDetail.download_url)">
                    下载
                  </el-button>
                </div>
                <div v-else>
                  暂无
                </div>
              </td></tr>
              <tr v-for="item in workOrderDetail.extra_fields"><td>{{ item.value || '暂无' }}</td></tr>
            </table>
          </el-col>
          <el-col :span="2">
            <table>
              <tr><td>工单ID</td></tr>
              <tr><td>产品线</td></tr>
              <tr><td>平台</td></tr>
              <tr><td>创建时间</td></tr>
              <tr><td>更新时间</td></tr>
            </table>
          </el-col>
          <el-col :span="8">
            <table>
              <tr><td>{{ workOrderDetail.order_task_id }}</td></tr>
              <tr><td>{{ workOrderDetail.order_product_name }}</td></tr>
              <tr><td>
                <span v-for="item in workOrderDetail.order_env_type">
                  <el-tag size="mini" type="success">{{ item.name }}</el-tag>
                  <span></span>
                </span>
              </td></tr>
              <tr><td>{{ workOrderDetail.create_time }}</td></tr>
              <tr><td>{{ workOrderDetail.update_time }}</td></tr>
            </table>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="工单需求" name="2">
        <div>{{  workOrderDetail.order_purpose }}</div>
      </el-collapse-item>
      <el-collapse-item title="工单结果" name="3">
        <div>{{  workOrderDetail.order_result }}</div>
      </el-collapse-item>
      <el-collapse-item title="审核信息" name="4" >
        <el-steps finish-status="success" process-status="wait"  :space="200"
                  :active="getElementIndex(workOrderDetail.audit_flow, workOrderDetail.current_audit_flow)" >
          <el-step icon="el-icon-user-solid"
                   :title="item.exec_user"
                   v-for="(item,index) in workOrderDetail.audit_flow"
                   :key="index" :description="item.status_name" ></el-step>
        </el-steps>
      </el-collapse-item>
      <el-collapse-item title="操作记录" name="6">
        <div v-for="(item,index) in workOrderDetail.operation_records" :key="index">
          <el-row>
            <el-col :span="6">{{ item.create_time }}</el-col>
            <el-col :span="3">{{ item.ops_user }}</el-col>
            <el-col :span="4">{{ item.status_name }}</el-col>
            <el-col :span="4">{{ item.ops_reply_content }}</el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="评论回复" name="7">
        <div v-for="(item,index) in workOrderDetail.operation_logs" :key="index">
          <el-row>
            <el-col :span="6">{{ item.create_time }}</el-col>
            <el-col :span="3">{{ item.ops_user }}</el-col>
            <el-col :span="4">{{ item.ops_reply_content }}</el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: 'workOrderHistoryAuditDetail',
    props: ['workOrderDetail'],
    data: function() {
      return {
        activeNames: ['1', '2', '3', '4']
      }
    },
    methods: {
      handleChange(val) {
        console.log(val)
      },
      downloadAttachment(url) {
        window.location.href = url
      },
      getElementIndex(flow_list, current_flow) {
        if (current_flow !== null) {
          const new_flow_list = []
          for (var i = 0; i < flow_list.length; i++) {
            new_flow_list.push(flow_list[i].exec_user)
          }
          return new_flow_list.indexOf(current_flow.exec_user) + 1
        } else {
          return
        }
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
