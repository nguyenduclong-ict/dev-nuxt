<template>
  <div>
    <router-link
      :to="{ name: 'AdminRoles' }"
      @click.native.prevent.stop="onClick"
    >
      Roles
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    onClick() {
      console.log('onClick')
    },
  },
})
</script>

<style scoped></style>
