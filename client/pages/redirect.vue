<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import { match } from 'path-to-regexp'
import { ROUTES } from '~/config/router/const'

export default Vue.extend({
  auth: false,
  asyncData({ from, query, route, params, redirect }) {
    const isAdminRoute = match('/admin/:child*')(from.path)

    const state = params.state

    if (state === 'logout') {
      if (isAdminRoute) redirect({ name: ROUTES.ADMIN_LOGIN })
      // if(from.path.match(/^admin(\/)+.*/))
    } else if (state === 'home') {
      if (isAdminRoute) redirect({ name: ROUTES.ADMIN })
    }
  },
})
</script>

<style scoped></style>
