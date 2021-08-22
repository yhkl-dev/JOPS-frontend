<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}"
       v-if="this.$route.path === '/resources/webssh'">
    <app-main></app-main>
  </div>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}" v-else>
      <sidebar class="sidebar-container"></sidebar>
      <div class="main-container">
          <navbar></navbar>
          <tags-view v-if="needTagsView" style="height: 40px; position: center"/>
          <app-main></app-main>
      </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from '@/views/layout/components'
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  computed: {
    ...mapState({
      needTagsView: state => state.settings.tagsView
    }),
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>
