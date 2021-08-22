<template>
  <div class="app-container">
    <el-card>
      <div slot="header" style="text-align: center">
        <span>流程项</span>
        <el-button style="float: right; padding: 3px 0"
                   size="mini"
                   type="text"
                   icon="el-icon-plus"
                   @click="handleAddOrderFlowItem">添加
        </el-button>
      </div>

      <el-table  :show-header="false"
                 :data="templateWorkOrderFlowList"
                 @row-dblclick="handleEditFlowItem" >
        <el-table-column label="" width="40px">
          <template slot-scope="scope">
            <el-tooltip >
              <div slot="content">
                创建时间: {{ scope.row.create_time }} <br/><br/>
                执行时间: {{ scope.row.change_time }}
              </div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="flow_name"
                         label="执行流程">
        </el-table-column>
        <el-table-column label="执行流程"
                         align="right">
          <template slot-scope="scope">
          <span v-if="scope.row.flow_type_name === 0">
            <el-tag size="mini" type="success">{{ scope.row.flow_type }}</el-tag>
          </span>
            <span v-else>
            <el-tag size="mini" type="danger">{{ scope.row.flow_type }}</el-tag>
          </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 5px ">
        <el-pagination @current-change="paginationChange"
                       :pager-count="5"
                       :page-size="searchForm.page_size"
                       layout="prev, pager, next"
                       :current-page.sync="searchForm.page"
                       :total="templateWorkOrderFlowListTotalNum"
                       v-show="templateWorkOrderFlowListTotalNum>0">
        </el-pagination>
      </div>
      <el-dialog title="添加流程" :visible.sync="addOrderFlowItemVisible" width="30%">
        <el-form ref="addFlowTypeItemForm" :rules="rules" :model="addFlowTypeItemForm" label-width="70px">
          <el-form-item prop="flow_name" label="流程名称 " label-width="80px">
            <el-input size="mini" v-model="addFlowTypeItemForm.flow_name"  placeholder="流程名称"></el-input>
          </el-form-item>
          <el-form-item prop="flow_type" label="流程类型 " label-width="80px">
            <el-select  v-model="addFlowTypeItemForm.flow_type" placeholder="流程类型"  size="mini" style="width: 100%">
              <el-option v-for="(item, index) in flowTypeChoice"
                         :key="index"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: 5px">
            <el-button type="primary"
                       size="small"
                       @click="handleSubmitAddFlowTypeItemForm">确 定</el-button>
            <el-button size="small"
                       @click="addOrderFlowItemVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="流程详情"
                 :visible.sync="updateFlowItemVisible"
                 width="55%">
        <el-form ref="updateFlowItemForm"
                 :rules="rules"
                 :model="updateFlowItemForm"
                 :inline="true" lable-width="80%">
          <el-steps :active="active"
                    space="160px"
                    class="step"
                    direction="vertical">
            <el-step  :title="flowItem.flow_item_name"
                      v-for="(flowItem, index) in updateTypeItemForm.flow_item"
                      :description="flowItem.exec_user"
                      :key="index">
              <template slot="description">
                <el-card >
                  <el-form-item v-if="active === index"
                                prop="flow_item_name"
                                label="名称" >
                    <el-input size="mini"
                              v-model="updateFlowItemForm.flow_item_name"
                              placeholder="流程名称"></el-input>
                  </el-form-item>
                  <el-form-item v-else prop="flow_item_name"
                                label="名称" >
                    <el-input size="mini"
                              v-model="flowItem.flow_item_name"
                              disabled placeholder="流程名称">
                    </el-input>
                  </el-form-item>

                  <el-form-item  v-if="active === index" prop="exec_user" label="执行用户" >
                    <el-select v-model="updateFlowItemForm.exec_user"
                               placeholder="执行用户"
                               size="mini"
                               style="width: 100%">
                      <el-option v-for="(item, index) in userList"
                                 :key="index"
                                 :label="item.username"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  v-else prop="exec_user" label="执行用户" >
                    <el-select v-model="flowItem.exec_user" placeholder="执行用户"  disabled size="mini" style="width: 100%">
                      <el-option v-for="(item, index) in userList"
                                 :key="index"
                                 :label="item.username"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item  v-if="active === index" prop="exec_order" label="执行顺序" >
                    <el-input size="mini"  v-model="updateFlowItemForm.exec_order"  placeholder="执行顺序"></el-input>
                  </el-form-item>
                  <el-form-item  v-else prop="exec_order" label="执行顺序" >
                    <el-input size="mini"  v-model="flowItem.exec_order"  disabled placeholder="执行顺序"></el-input>
                  </el-form-item>

                  <el-form-item >
                    <el-button size="mini"
                               type="primary"
                               icon="el-icon-edit" circle
                               v-if="active !== index"
                               @click="editTaskFlowItem(flowItem, index)"></el-button>
                    <el-button size="mini"
                               type="success"
                               icon="el-icon-check"
                               v-if="active === index"
                               circle
                               @click="commitEditTaskFlowItem(updateFlowItemForm)"></el-button>
                    <el-button size="mini"
                               type="danger"
                               icon="el-icon-delete"
                               circle @click="deleteTaskFlowItem(flowItem, index)"></el-button>
                  </el-form-item>
                </el-card>
              </template>
            </el-step>
          </el-steps>
          <el-form-item>
            <el-button type="primary" size="mini" style="margin-left: 35px" @click="addFlowItem">添加审核人</el-button>
          </el-form-item>
        </el-form>
        <el-form ref="updateTypeItemForm" :model="updateTypeItemForm" label-width="80px">
          <el-form-item prop="flow_name" label="流程名称 " label-width="80px">
            <el-input size="mini" v-model="updateTypeItemForm.flow_name"  placeholder="流程名称"></el-input>
          </el-form-item>
          <el-form-item prop="flow_type" label="流程类型 " label-width="80px">
            <el-select  v-model="updateTypeItemForm.flow_type" placeholder="执行用户"  size="mini" style="width: 100%">
              <el-option v-for="(item, index) in flowTypeChoice"
                         :key="index"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="create_time" label="添加时间 " label-width="80px">
            <el-input size="mini" v-model="updateTypeItemForm.create_time"  :disabled="true" placeholder="添加时间"></el-input>
          </el-form-item>
          <el-form-item prop="change_time" label="更新时间 " label-width="80px">
            <el-input size="mini" v-model="updateTypeItemForm.change_time" :disabled="true" placeholder="更新时间"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" size="mini" @click="updateFlow">确 定</el-button>
            <el-button size="mini" @click="updateFlowItemVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { addTemplateWorkOrderTaskFlowItem,
    updateTemplateWorkOrderTaskFlowItem,
    addTemplateWorkOrderTaskFlow,
    updateTemplateWorkOrderTaskFlow,
    deleteTemplateWorkOrderTaskFlowItem } from '@/api/workorder'

  export default {
    name: 'workOrderFlowManager',
    props: ['templateWorkOrderFlowList', 'userList', 'templateWorkOrderFlowListTotalNum'],
    data() {
      return {
        addOrderFlowVisible: false,
        updateFlowItemVisible: false,
        addOrderFlowItemVisible: false,
        active: '',
        flowItems: [],
        flowTypeChoice: [
          { id: 0, name: '执行' },
          { id: 1, name: '审核' }
        ],
        updateFlowItemForm: {
          id: '',
          exec_order: '',
          flow_item_name: '',
          exec_user: '',
          belong_flow: ''
        },
        addFlowItemForm: {
          exec_order: '',
          flow_item_name: '',
          exec_user: ''
        },
        updateTypeItemForm: {
          id: '',
          flow_name: '',
          flow_type: '',
          // flow_type_name: '',
          flow_item: [],
          change_time: '',
          create_time: ''
        },
        searchForm: {
          page: 1,
          page_size: 8
        },
        addFlowTypeItemForm: {
          flow_name: '',
          flow_type: ''
        },
        rules: {
          flow_item_name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addFlowItem() {
        const flowItem = {
          exec_order: '',
          flow_item_name: '',
          exec_user: ''
        }
        this.updateTypeItemForm.flow_item.push(flowItem)
        this.editTaskFlowItem(flowItem, this.updateTypeItemForm.flow_item.length - 1)
      },
      handleAddOrderFlowItem() {
        this.addOrderFlowItemVisible = true
        if (this.$ref['addFlowTypeItemForm'] !== undefined) {
          this.$ref['addFlowTypeItemForm'].resetFields()
        }
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.$emit('fresh', this.searchForm)
      },
      handleSubmitAddFlowTypeItemForm() {
        addTemplateWorkOrderTaskFlow(this.addFlowTypeItemForm).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.addOrderFlowItemVisible = false
          this.$emit('fresh')
        })
      },
      handleEditFlowItem(row) {
        this.updateFlowItemVisible = true
        const { id, flow_name, flow_type_name, flow_item, change_time, create_time } = row
        this.FlowItems = flow_item
        this.updateTypeItemForm = { id, flow_name, flow_type: flow_type_name, flow_item, change_time, create_time }
      },
      editTaskFlowItem(row, index) {
        const { id, exec_order, flow_item_name, exec_user } = row
        const belong_flow = this.updateTypeItemForm.id
        this.active = index
        this.updateFlowItemForm = { id, exec_order, flow_item_name, exec_user, belong_flow }
      },
      deleteTaskFlowItem(row, index) {
        if (row.id !== undefined) {
          this.$confirm('此操作将删除 [ ' + row.flow_item_name + ' ] 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteTemplateWorkOrderTaskFlowItem(row.id).then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.updateTypeItemForm.flow_item.pop(index)
              this.$emit('fresh')
            })
          }).catch(() => {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          })
        } else {
          this.updateTypeItemForm.flow_item.pop(index)
        }
      },
      commitEditTaskFlowItem(row) {
        if (typeof row.exec_user === 'string') {
          this.active = ''
        } else if (row.id !== undefined) {
          const { id, exec_order, flow_item_name, exec_user, belong_flow } = row
          this.updateFlowItemForm = { id, exec_order, flow_item_name, exec_user, belong_flow }
          updateTemplateWorkOrderTaskFlowItem(row.id, row).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        } else {
          addTemplateWorkOrderTaskFlowItem(row).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          })
        }
        this.active = ''
      },
      updateFlow() {
        const flowForm = {
          id: this.updateTypeItemForm.id,
          flow_name: this.updateTypeItemForm.flow_name,
          flow_type: this.updateTypeItemForm.flow_type
        }
        updateTemplateWorkOrderTaskFlow(flowForm.id, flowForm).then(() => {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.updateFlowItemVisible = false
          this.$emit('fresh')
        })

        // if (typeof flowForm.flow_type === 'string') {
        //   this.active = ''
        //   this.updateFlowItemVisible = false
        // } else {
        // }
      }
    }
  }
</script>

<style>
  .el-steps .el-step:last-of-type .el-step__description {
    padding-right: 10% !important;
  }
</style>
<style scoped>
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>

