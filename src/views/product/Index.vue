<template>
  <div class="app-container">
    <el-row :gutter="24" class="row-box">
      <el-col :span="8">
        <el-card class="product-class" style="">
          <div slot="header" >
            <span style="font-weight: bolder">Product List</span>
            <el-button style="float: right; padding: 3px 0" type="text" size="mini" @click="handleAddProduct">Add</el-button>
          </div>
          <el-table v-loading="loading"
                    ref="productTable"
                    :show-header="false"
                    element-loading-text="loading"
                    size="mini"
                    :highlight-current-row="true"
                    :row-style="rowClass"
                    @row-click="handleRowClick"
                    class="bg-purple"
                    :data="productList">
            <el-table-column prop="product_name" label="Product Name" width="150px" ></el-table-column>
            <el-table-column prop="update_time" label="Update Time"></el-table-column>
            <el-table-column prop="" label="options" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click.native.stop="handleEditClick(scope.row)" >edit</el-button>
                <el-button size="small" type="text" @click="handlerDeleteResource(scope.row)">delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="el-card">
          <div slot="header" style="text-align: center">
            <span style="font-weight: bolder;">Project List</span>
          </div>
          <el-table v-loading="projectLoading"
                    element-loading-text="loading"
                    size="mini"
                    :data="projectList"
                    :header-cell-style="headClass"
                    :row-style="rowClass">
            <el-table-column prop="project_name"  label="Name" align="center"></el-table-column>
            <el-table-column label="Project Type" align="center">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.project_type_icon"></svg-icon>
              </template>
            </el-table-column>
            <el-table-column prop="github_repo_url" label="GITHUB URL" align="center" width="200px"></el-table-column>
            <el-table-column prop="belong_group" label="Belong Group" align="center"></el-table-column>
            <el-table-column prop="deployment_server_dev" label="Development ENV" align="center"></el-table-column>
            <el-table-column prop="deployment_server_prod" label="Product ENV" align="center"></el-table-column>
            <el-table-column label="Operators" align="center">
              <template slot-scope="scope">
                <div v-for="(item, value) in scope.row.ops_users_list" :key="value">
                  <el-tag type="info">{{ item.username }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Developers" align="center">
              <template slot-scope="scope">
                <div v-for="(item, value) in scope.row.dev_users_list" :key="value">
                  <el-tag type="info">{{ item.username }}</el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top: 20px">
          <div slot="header" style="text-align: center">
            <span style="font-weight: bolder">Product Info</span>
          </div>
          <el-tabs @tab-click="handleClick">
              <el-tab-pane label="Development Environment" name="first">
                <div>
                  dev
                </div>
              </el-tab-pane>
              <el-tab-pane label="Product Environment" name="second">
                <div>
                  prod
                </div>
              </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible="dialogVisible" title="Add Product">
      <el-form :form="productForm">
        <el-form-item label="Product Name: " >
          <el-input v-model="productForm.product_name"
                    placeholder="Please input product name">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleSaveProduct">CONFIRM</el-button>
        <el-button size="mini" @click="handleCancel">CANCEL</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getProduct, createProduct } from '@/api/product'
  import { getProjectList } from '@/api/project'

  export default {
    name: 'Product',
    data() {
      return {
        loading: false,
        projectLoading: false,
        dialogVisible: false,
        productList: [],
        projectList: [],
        queryProject: {
          belong_product: ''
        },
        productForm: {
          product_name: ''
        }
      }
    },
    watch: {
      productList: function() {
        this.$nextTick(function() {
          this.$refs.productTable.setCurrentRow(this.productList[0])
          this.queryProject.belong_product = this.productList[0].id
          this.fetchProjectList(Object.assign(this.queryProject))
        })
      }
    },
    methods: {
      fetchProductList(params) {
        this.loading = true
        getProduct(params).then(res => {
          this.productList = res.results
          this.loading = false
        })
      },
      fetchProjectList(params) {
        this.projectLoading = true
        getProjectList(params).then(res => {
          this.projectList = res.results
          this.projectLoading = false
        })
      },
      handleRowClick(row, column) {
        const query = {
          belong_product: row.id
        }
        console.log('xxxx')
        this.fetchProjectList(Object.assign(query))
      },
      handleAddProduct() {
        this.dialogVisible = true
      },
      handleCancel() {
        this.dialogVisible = false
      },
      handleSaveProduct() {
        createProduct(this.productForm).then(() => {
          this.$message({
            message: 'ADD SUCCESS',
            type: 'success'
          })
          this.fetchProductList()
          this.dialogVisible = false
        })
      },
      handlerDeleteResource(row) {

      },
      headClass() {
        return 'text-align:center;background:#eef1f6;font-weight:bold;color:#606266'
      },
      rowClass() {
        return 'text-align: center;'
      },
      handleEditClick(row) {

      }
    },
    created() {
      this.fetchProductList()
    }
  }
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-card__header {
    background-color: #d3dce6;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .el-table__body tr.current-row>td {
    background: #f57878 !important;
  }
  .row-box {
    display: flex;
    flex-flow: wrap;
    min-width: 100%;
    height: 100%;
    border: 0px;
  }
  /*.row-box .el-card {*/
  /*  min-width: 100%;*/
  /*  height: 100%;*/
  /*  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);*/
  /*}*/
  .el-card /deep/ .el-card__body {
    padding: 6px;
  }
  .el-card /deep/ .el-card__header {
    padding: 8px 20px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    background-color: lightgrey;
  }
  .product-class {
    height:600px;
    overflow-y:auto;
    overflow-x:hidden;
  }
</style>
