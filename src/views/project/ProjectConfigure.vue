<template>
    <div>
      <div class="filter-container" >
        <el-form :inline="true"
                 :model="addParameterForm">
          <el-form-item>
            <el-button type="success"
                       v-if="addFormVisible === false"
                       size="mini"
                       icon="el-icon-plus"
                       @click="handleAddParameter"
                       circle>
            </el-button>
            <el-button v-if="addFormVisible === true"
                       type="danger"
                       size="mini"
                       icon="el-icon-minus"
                       @click="addFormVisible = false"
                       circle>
            </el-button>
          </el-form-item>
          <el-form-item v-if="addFormVisible" label="key">
            <el-input width="80%"
                      v-model="addParameterForm.item_name"
                      placeholder="key"
                      size="mini">
            </el-input>
          </el-form-item>
          <el-form-item v-if="addFormVisible"
                        label="value">
            <el-input width="80%"
                      v-model="addParameterForm.item_value"
                      placeholder="value"
                      size="mini"></el-input>
          </el-form-item>
          <el-form-item v-if="addFormVisible">
            <el-button size="mini"
                       type="text"
                       @click="handleCommitAddParameter">
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="projectConfigureParameter"
                :show-header="false">
        <el-table-column align="left" >
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-row>
                <el-col>
                  <el-input v-model="row.name"
                            size="mini">
                  </el-input>
                </el-col>
              </el-row>
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-row :gutter="5">
                <el-col :span="20">
                  <el-input v-model="row.value"
                            class="edit-input"
                            size="mini">
                  </el-input>
                </el-col>
                <el-col :span="1">
                  <el-button size="mini"
                             icon="el-icon-refresh"
                             type="text"
                             @click="cancelEdit(row)">cancel
                  </el-button>
                </el-col>
              </el-row>
            </template>
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" >
          <template slot-scope="{row}">
            <el-button v-if="row.edit"
                       type="success"
                       size="mini"
                       icon="el-icon-check"
                       circle
                       @click="confirmEdit(row)">
            </el-button>
            <el-button v-else
                       type="text"
                       size="mini"
                       circle
                       plain
                       icon="el-icon-edit"
                       @click="row.edit=!row.edit">
            </el-button>
            <el-button size="mini"
                       type="text"
                       plain
                       @click="handleDeleteParams(row)"
                       icon="el-icon-delete"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  import { updateProjectConfigure, addProjectConfigure, deleteProjectConfigure } from '@/api/project'

  export default {
    name: 'ProjectConfigure',
    props: ['projectConfigureParameter', 'projectId'],
    data() {
      return {
        addFormVisible: false,
        addParameterForm: {
          item_name: '',
          item_value: '',
          belong_project: ''
        }
      }
    },
    methods: {
      handleCommitAddParameter() {
        this.addParameterForm.belong_project = this.projectId
        addProjectConfigure(this.addParameterForm).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.addFormVisible = false
          this.$emit('refresh')
        })
      },
      handleAddParameter() {
        this.addFormVisible = true
      },
      cancelEdit(row) {
        row.value = row.originalValue
        row.name = row.originalName
        row.edit = false
        this.$message({
          message: 'The Parameter has been restored to the original value',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalValue = row.value
        row.originalName = row.name
        const changeParameter = {
          id: row.id,
          item_name: row.name,
          item_value: row.value,
          belong_project: this.projectId
        }
        try {
          updateProjectConfigure(changeParameter.id, changeParameter).then(
            () => {
              this.$message({
                message: 'The parameter has been edited',
                type: 'success'
              })
              this.$emit('refresh')
            }
          )
        } catch (err) {
          row.value = row.originalValue
          row.name = row.originalName
          this.$message({
            message: 'The parameter change failed',
            type: 'danger'
          })
        }
      },
      handleDeleteParams(row) {
        this.$confirm('此操作将删除 [ ' + row.name + ' ] 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProjectConfigure(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.$emit('refresh')
          })
        }).catch(() => {
          this.$message({
            message: '操作失败',
            type: 'warning'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
