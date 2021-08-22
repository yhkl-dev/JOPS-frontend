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
      <el-collapse-item title="执行信息" name="5">
        <el-steps finish-status="success" process-status="wait" :space="200"
                  :active="getElementIndex(workOrderDetail.exec_flow, workOrderDetail.current_exec_flow)" >
          <el-step icon="el-icon-user-solid"
                   :title="item.exec_user"
                   v-for="(item,index) in workOrderDetail.exec_flow"
                   :key="index" :description="item.status_name"></el-step>
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
        <div style="margin-top: 20px;">
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input clearable
                        size="small"
                        placeholder="请输入内容"
                        v-model="replyContent">
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="primary"
                         size="small"
                         @click="handleReplyWorkOrder(workOrderDetail.id)">发 送
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item title="操作" name="8">
        <el-row :gutter="5">
          <el-col :span="1.5">
            <el-button v-if="workOrderDetail.status_code === 1 && workOrderDetail.audit_flow[0].status_code === null"
                       type="primary"
                       size="mini"
                       disabled
                       @click="handleReEditWorkOrderOperation(workOrderDetail.id)">重新编辑
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-if="workOrderDetail.status_code === 2 && workOrderDetail.audit_flow[0].status_code === null"
                       type="danger"
                       size="mini"
                       @click="handleCancelWorkOrderOperation(workOrderDetail.id)">撤 回
            </el-button>
            <el-button v-else
                       type="danger"
                       size="mini"
                       disabled
                       @click="handleCancelWorkOrderOperation(workOrderDetail.id)">撤 回
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-if="workOrderDetail.status_code === 7 || workOrderDetail.status_code === 6 || workOrderDetail.status_code === 8"
                       type="primary"
                       size="mini"
                       @click="handleConfirmWorkOrderOperation(workOrderDetail.id)">确 认
            </el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: 'workOrderDetail',
    props: ['workOrderDetail'],
    data() {
      return {
        activeNames: ['1', '2', '3', '4', '8'],
        replyContent: '',
        replyWorkOrderTaskForm: {
          ops_status: 15,
          ops_reply_content: '',
          work_order: ''
        },
        workOrderOperationForm: {
          ops_status: '',
          work_order: ''
        }
      }
    },
    methods: {
      handleChange(val) {
        console.log(val)
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
      },
      downloadAttachment(url) {
        window.location.href = url
      },
      handleReplyWorkOrder(id) {
        this.replyWorkOrderTaskForm.ops_reply_content = this.replyContent
        this.replyWorkOrderTaskForm.work_order = id
        this.$emit('replyWorkOrderTaskForm', this.replyWorkOrderTaskForm)
        this.replyContent = ''
      },
      handleReEditWorkOrderOperation(id) {
        this.workOrderOperationForm.ops_status = 13
        this.workOrderOperationForm.work_order = id
        this.$emit('handleWorkOrderOperation', this.workOrderOperationForm)
      },
      handleCancelWorkOrderOperation(id) {
        this.workOrderOperationForm.ops_status = 14
        this.workOrderOperationForm.work_order = id
        this.$emit('handleWorkOrderOperation', this.workOrderOperationForm)
      },
      handleConfirmWorkOrderOperation(id) {
        this.workOrderOperationForm.ops_status = 11
        this.workOrderOperationForm.work_order = id
        this.$emit('handleWorkOrderOperation', this.workOrderOperationForm)
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
