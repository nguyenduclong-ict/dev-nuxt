<template>
  <el-menu-item-group v-if="item.type === 'group'" :title="item.name">
    <sidebar-item
      v-for="child in item.children"
      :key="child.name"
      :item="child"
    />
  </el-menu-item-group>
  <el-submenu v-else-if="_.get(item, 'children.length')" :index="item.name">
    <template slot="title">
      <i v-if="item.icon" :class="item.icon"></i>
      <span>{{ $t(item.name) }}</span>
    </template>
    <sidebar-item
      v-for="child in item.children"
      :key="child.name"
      :item="child"
    />
  </el-submenu>
  <el-menu-item
    v-else
    :index="item.path"
    :route="item.route"
    @click="handleMenuClick"
  >
    <i v-if="item.icon" :class="item.icon"></i>
    <span>{{ $t(item.name) }}</span>
  </el-menu-item>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'SidebarItem',
  components: { ElMenuItem: MenuItem },

  props: {
    item: {
      type: Object,
      require: true,
    },
  },

  methods: {
    handleMenuClick() {
      if (this.$store.state.responsive === 'sm') {
        this.$store.commit('admin/toggleSidebar')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
