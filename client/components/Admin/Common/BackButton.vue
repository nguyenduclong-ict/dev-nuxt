<template>
  <div
    v-if="canBack"
    class="
      text-gray-900
      font-bold
      text-2xl
      cursor-pointer
      inline-flex
      justify-center
      hover:text-primary
    "
    @click="handleGoback"
  >
    <i class="el-icon-back"></i>
    <span v-if="showText && (text || prevRouteName)" class="ml-1 text-base">
      {{ text || prevRouteName }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { RouteItem } from '~/config'

export default Vue.extend({
  props: {
    text: String,

    showText: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapGetters(['canBack']),
    prevRoute(): RouteItem {
      return this.$store.state.histories[
        this.$store.state.histories.length - 2
      ] as any
    },
    prevRouteName(): string {
      return this.prevRoute?.meta?.title || this.prevRoute?.name
    },
  },

  methods: {
    handleGoback() {
      this.$router.back()
    },
  },
})
</script>

<style scoped></style>
