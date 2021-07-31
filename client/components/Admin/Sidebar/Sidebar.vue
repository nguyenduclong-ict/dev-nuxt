<template>
  <div class="sidebar" :class="{ collapse: sidebar.collapse }">
    <div class="backdrop" @click="handleBackdropClick"></div>

    <div
      class="sidebar-content"
      :style="{ 'background-color': variables.menuBg }"
    >
      <div class="topbar flex items-center justify-center">
        <img class="logo" src="/icon.png" />
      </div>

      <el-scrollbar class="menu-scrollbar" wrap-style="overflow-x: hidden;">
        <el-menu
          ref="menu"
          class="admin-sidebar-menu"
          :default-active="active"
          :collapse="sidebar.collapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          router
          mode="vertical"
        >
          <SidebarItem
            v-for="item in sidebarItems"
            :key="item.name"
            :item="item"
          />
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
import SidebarItem from './SidebarItem.vue'
// @ts-ignore
import variables from '~/assets/scss/variables.scss'

export default Vue.extend({
  components: { SidebarItem },
  data() {
    return {
      active: '',
      variables,
    }
  },

  computed: {
    ...mapState(['responsive']),
    ...mapState('admin', ['sidebar']),
    ...mapGetters('admin', ['sidebarItems']),
  },

  watch: {
    '$route.name'() {
      ;(this.$refs.menu as any).activeIndex =
        this.$route.meta?.sidebarKey || this.$route.path.replace(/\/+$/g, '')
    },
  },

  created() {
    this.active =
      this.$route.meta?.sidebarKey || this.$route.path.replace(/\/+$/g, '')
  },

  methods: {
    handleBackdropClick() {
      this.$store.commit('admin/toggleSidebar')
    },
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/variables.scss';

.sidebar {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: $menuBg;
  left: 0;
  top: 0;
  transition: all 0.3s;
  width: $sideBarWidth;
  z-index: 1000;

  &.collapse {
    width: 64px;
  }

  .backdrop {
    display: none;
  }

  @media screen and (max-width: 640px) {
    // mobile
    transition: all 0.5s;
    position: fixed;
    top: 0;
    left: 0;

    .menu-scrollbar {
      height: 100%;
    }

    &:not(.collapse) {
      .sidebar-content {
        z-index: 1001;
        height: 100%;
      }

      .backdrop {
        display: block;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.3);
      }
    }

    &.collapse {
      left: -1 * $sideBarWidth;
    }
  }

  .el-submenu i,
  .el-menu-item i {
    color: $menuText;
  }

  .el-submenu [class^='icofont-'],
  .el-menu-item [class^='icofont-'] {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }

  .el-menu-item.is-active i {
    color: $menuActiveText;
  }

  .topbar {
    height: 48px;
    width: 100%;

    .logo {
      width: 32px;
      height: 32px;
    }
  }

  .menu-scrollbar {
    flex: 1;
    overflow-x: hidden;
    height: 100%;
  }

  .admin-sidebar-menu {
    border: none;
  }

  .admin-sidebar-menu:not(.el-menu--collapse) {
    width: $sideBarWidth;
  }

  .el-menu--collapse > .el-menu-item-group > .el-menu-item-group__title {
    display: none;
  }

  .el-menu--collapse {
    .el-menu-item-group {
      .el-menu-item span,
      .el-menu--collapse > .el-submenu > .el-submenu__title span {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
      }
    }
  }
}
</style>
