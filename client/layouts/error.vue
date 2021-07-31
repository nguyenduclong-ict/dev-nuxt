<template>
  <div
    class="
      container
      h-screen
      w-screen
      flex
      justify-center
      items-center
      mx-auto
      my-auto
    "
  >
    <PageError v-if="error.statusCode === 500" :error="error" />
    <Page404 v-if="error.statusCode === 404" :error="error" />
    <Page401 v-if="error.statusCode === 401" :error="error" />
    <Page403 v-if="error.statusCode === 403" :error="error" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Page401 from '~/components/Page401.vue'
import Page403 from '~/components/Page403.vue'
import Page404 from '~/components/Page404.vue'
import PageError from '~/components/PageError.vue'

export default Vue.extend({
  components: { Page404, Page401, Page403, PageError },
  props: {
    error: {
      type: Object,
    },
  },
})
</script>

<style scoped></style>
