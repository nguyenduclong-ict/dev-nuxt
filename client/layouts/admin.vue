<template>
  <div class="admin-layout">
    <div class="sidebar-wrapper">
      <Sidebar />
    </div>

    <el-scrollbar class="content-wrapper">
      <Navbar />

      <div class="main">
        <nuxt></nuxt>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import Vue from 'vue'
import Sidebar from '~/components/Admin/Sidebar/Sidebar.vue'
import Navbar from '~/components/Admin/Navbar.vue'

export default Vue.extend({
  components: { Sidebar, Navbar },
})
</script>

<style lang="scss">
.admin-layout {
  display: flex;
  height: 100vh;

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;

    .el-scrollbar__wrap {
      overflow-x: auto;
    }

    .main {
      flex: 1;
    }

    .page {
      @apply p-4;

      .page-header {
        display: flex;
        gap: 4px;
      }

      .page-content {
        margin-top: 12px;
      }
    }
  }
}
</style>
