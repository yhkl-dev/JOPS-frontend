<template>
    <div class="app-container">
      <el-row :gutter="24">
        <el-col :span="7" :xs="24">
          <el-card>
            <div
              slot="header"
              class="clearfix">
              <span>项目列表</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="handleAddProject"
                icon="el-icon-plus"
                circle>
              </el-button>
            </div>
            <el-table :data="projectList" v-loading="loading" :show-header="false" @row-click="handleClick">
              <el-table-column prop="project_name"
                               label="项目名称"
                               align="center"
                               width="300px"></el-table-column>
              <el-table-column label="" align="right">
                <template slot-scope="scope">
                  <el-button size="small"
                             type="text"
                             @click="handleUpdateProject(scope.row)">
                    edit
                  </el-button>
                  <el-button size="small"
                             type="text"
                             @click="handleDeleteProject(scope.row)">
                    delete
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination background
                             @current-change="paginationChange"
                             :pager-count="5"
                             :page-size="searchForm.page_size"
                             layout="total, prev, pager, next, jumper"
                             :current-page.sync="searchForm.page"
                             :total="totalNum"
                             v-show="totalNum>=15">
              </el-pagination>
            </div>
          </el-card>
        </el-col>
        <el-col :span="17" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="参数配置" name="Parameter">
                <span>
                  <h4>{{ this.projectName }}</h4>
                </span>
                <project-configure
                  v-bind:project-configure-parameter="projectConfigureParameter"
                  @refresh="refresh"
                  v-bind:projectId="projectId">
                </project-configure>
              </el-tab-pane>
              <el-tab-pane label="部署信息" name="timeline">
                <div>hello world</div>
              </el-tab-pane>
              <el-tab-pane label="项目统计" name="account">
                <div>hello world</div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>


      <el-dialog
        title="新建项目"
        :visible.sync="addProjectVisible"
        width="45%">
        <el-form
          :inline="true"
          :rules="rules"
          :model="addProjectForm" >
          <el-form-item
            label="项目名称（中文)"
            prop="project_name_zh">
            <el-input
              size="mini"
              v-model="addProjectForm.project_name_zh"
              placeholder="项目名称（中文)">
            </el-input>
          </el-form-item>
          <el-form-item
            label="项目名称（英文)"
            prop="project_name_en">
            <el-input
              size="mini"
              v-model="addProjectForm.project_name_en"
              placeholder="项目名称（英文)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="handleCommitAddProject">
              确定
            </el-button>
            <el-button
              size="mini"
              @click="addProjectVisible = false">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="编辑项目"
                 :ref="updateProjectForm"
                 :visible.sync="updateProjectVisible"
                 width="45%">
        <el-form :inline="true"
                 :rules="rules"
                 :model="updateProjectForm" >
          <el-form-item
            label="项目名称（中文)"
            prop="project_name_zh">
            <el-input
              size="mini"
              v-model="updateProjectForm.project_name_zh"
              placeholder="项目名称（中文)">
            </el-input>
          </el-form-item>
          <el-form-item
            label="项目名称（英文)"
            prop="project_name_en">
            <el-input
              size="mini"
              v-model="updateProjectForm.project_name_en"
              placeholder="项目名称（英文)">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="handleCommitUpdateProject">
              确定
            </el-button>
            <el-button
              size="mini"
              @click="updateProjectVisible = false">
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  import { getProjectList, addProjectList, updateProjectList } from '@/api/project'
  import ProjectConfigure from './ProjectConfigure'

  export default {
    name: 'ProjectList',
    components: { ProjectConfigure },
    data() {
      return {
        loading: false,
        addProjectVisible: false,
        updateProjectVisible: false,
        activeTab: 'Parameter',
        projectList: [],
        projectConfigureParameter: [],
        searchForm: {
          page: 1,
          page_size: 5
        },
        addProjectForm: {
          project_name_en: '',
          project_name_zh: ''
        },
        updateProjectForm: {
          id: '',
          project_name_en: '',
          project_name_zh: ''
        },
        projectId: '',
        projectName: '',
        totalNum: 0,
        rules: {
          project_name_zh: [
            { required: true, message: '请输入项目中文名', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ],
          project_name_en: [
            { required: true, message: '请输入项目英文名', trigger: 'blur' },
            { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getProjectList(this.searchForm).then(
          res => {
            this.projectList = res.results
            this.totalNum = res.count
            this.loading = false
          }
        )
      },
      handleClick(row) {
        this.projectConfigureParameter = row.configurations
        this.projectId = row.id
        this.projectName = row.project_name
        const items = this.projectConfigureParameter
        this.projectConfigureParameter = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalValue = v.value //  will be used when user click the cancel botton
          v.originalName = v.name//  will be used when user click the cancel botton
          return v
        })
      },
      refresh() {
        this.fetchData()
      },
      handleAddProject() {
        if (this.$refs['addProjectForm'] !== undefined) {
          this.$refs['addProjectForm'].resetFields()
        }
        this.addProjectVisible = true
      },
      handleCommitAddProject() {
        addProjectList(this.addProjectForm).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.addProjectVisible = false
          this.fetchData()
        })
      },
      handleUpdateProject(row) {
        this.updateProjectVisible = true
        const { id, project_name_en, project_name_zh } = row
        this.updateProjectForm = { id, project_name_en, project_name_zh }
      },
      handleCommitUpdateProject() {
        updateProjectList(this.updateProjectForm.id, this.updateProjectForm).then(() => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.updateProjectVisible = false
          this.fetchData()
        })
      },
      handleDeleteProject(row) {
        this.$confirm('此操作将删除 [ ' + row.project_name + ' ] 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const { id, project_name_en, project_name_zh } = row
          const is_deleted = 1
          const deleteForm = { id, project_name_en, project_name_zh, is_deleted: is_deleted }
          updateProjectList(deleteForm.id, deleteForm).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.updateProjectVisible = false
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '操作失败',
            type: 'warning'
          })
        })
      },
      paginationChange(val) {
        this.searchForm.page = val
        this.fetchData()
      }
    },
    created() {
      this.fetchData()
    }
  }

</script>

<style scoped>

</style>
