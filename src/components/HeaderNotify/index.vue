<template>
  <div class="header-search" @click="openMessageBox">
    <svg-icon class-name="search-icon" icon-class="notify" />
  </div>
</template>

<script>

export default {
  name: 'HeaderNotify',
  data() {
    return {
    }
  },
  methods: {
    openMessageBox() {
      this.$emit('openMessageBox')
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-search {
    font-size: 0 !important;

    .search-icon {
      cursor: pointer;
      font-size: 20px;
      vertical-align: middle;
    }

    .header-search-select {
      font-size: 18px;
      transition: width 0.2s;
      width: 0;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>
