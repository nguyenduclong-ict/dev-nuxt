<template>
  <nuxt-child />
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  auth: true,
  layout: 'admin',
})
</script>

<style scoped></style>
