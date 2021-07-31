<template>
  <div class="navbar-wrapper" :class="{ fixed, collapse: sidebar.collapse }">
    <nav class="admin-navbar flex items-center">
      <!-- ts-ignore -->
      <div class="hamburger" @click="toggleSidebar()">
        <i
          class="icon"
          :class="[sidebar.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
        ></i>
      </div>
      <!-- Breadcrumbs -->

      <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item
            v-for="(item, index) in levelList"
            :key="item.path"
          >
            <span
              v-if="
                item.redirect === 'noRedirect' || index == levelList.length - 1
              "
              class="no-redirect"
            >
              {{ item.name }}
            </span>
            <component
              :is="item.path ? 'nuxt-link' : 'span'"
              v-else
              :to="item.path"
            >
              {{ item.name }}
            </component>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>

      <div class="flex-1"></div>

      <el-dropdown trigger="click" class="pr-4" @command="handleCommand">
        <div class="h-full flex items-center">
          <Avatar />
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-key" command="change-password">
            {{ $t('Đổi mật khẩu') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout" icon="icofont-logout" divided>
            {{ $t('Đăng xuất') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'
import Avatar from './Common/Avatar.vue'

export default Vue.extend({
  components: { Avatar },
  props: {
    fixed: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('admin', ['sidebar', 'sidebarItems']),
    levelList() {
      const list: { name: string; path: string; redirect: string }[] = []

      this.$route.matched.forEach((route) => {
        list.push({
          name: route.meta.getTitle
            ? eval(route.meta.getTitle).call(null, {
                route: this.$route,
                entities: this.$store.state.admin.entities,
              })
            : route.meta?.title ||
              (this.sidebarItems || []).find((e: any) => e.path === route.path)
                ?.name ||
              route.name,
          path: route.path,
          redirect: route.redirect?.toString(),
        })
      })

      return list
    },
  },
  methods: {
    ...mapMutations<'toggleSidebar'>('admin', ['toggleSidebar']),
    handleCommand(command: string) {
      switch (command) {
        case 'logout':
          this.$auth.logout({
            data: {
              refreshToken: (
                this.$auth.strategy as any
              ).refreshToken.$storage.getUniversal('_refresh_token.local'),
            },
          })
          break

        case 'change-password':
          break

        default:
          break
      }
    },
  },
})
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables.scss';
.navbar-wrapper {
  width: 100%;
  height: 48px;

  position: relative;

  &.fixed .admin-navbar {
    transition: all 0.3s;
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - #{$sideBarWidth});
  }

  &.collapse .admin-navbar {
    width: calc(100% - 64px);
  }

  @media screen and (max-width: 640px) {
    &.fixed .admin-navbar {
      width: 100%;
    }
  }

  .admin-navbar {
    z-index: 998;
    background: #fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    overflow: hidden;
    height: 48px;

    .hamburger {
      @apply flex items-center justify-center cursor-pointer;
      &:active {
        @apply bg-gray-50;
      }

      .icon {
        font-size: 20px;
      }

      width: 48px;
      height: 48px;
    }

    .app-breadcrumb.el-breadcrumb {
      display: inline-block;
      font-size: 14px;
      line-height: 50px;
      margin-left: 8px;
      .no-redirect {
        color: #97a8be;
        cursor: text;
      }
    }
  }
}
</style>
