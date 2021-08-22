<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.child-item .el-menu-item{
  background-color: #1F2D3D!important;
}
.child-item .el-menu-item:hover{
  background-color: #001528!important;
}
.child-item .el-submenu__title{
  background-color: #1F2D3D!important;
}
.child-item .el-submenu__title:hover{
  background-color: #001528!important;
}
</style>

