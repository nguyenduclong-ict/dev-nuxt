<template>
  <span
    :style="{
      width: size + 'px',
      height: size + 'px',
      lineHeight: size + 'px',
      '--color': _color,
    }"
    class="inline-flex avatar"
  >
    <el-avatar
      v-if="_src"
      class="break-clear"
      :src="_src"
      :size="size"
      :shape="shape"
    ></el-avatar>

    <el-avatar
      v-else-if="text"
      class="break-clear"
      :size="size"
      :shape="shape"
      :style="{
        backgroundColor: _color,
        fontSize: textSize + 'px',
      }"
    >
      {{ getFirstCharacterOfEachWordInString(text) }}
    </el-avatar>

    <el-avatar
      v-else
      class="break-clear"
      :src="defaultImg"
      :size="size"
      :style="{ backgroundColor: '#C0C4CC' }"
      :shape="shape"
    ></el-avatar>
  </span>
</template>

<script>
import { getRandomColor } from '@/utils'
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    textSize: {
      type: Number,
      default: 14,
    },
    size: {
      type: [Number, String],
      default: 32,
    },
    shape: {
      type: String,
      default: 'circle',
    },
    defaultImg: {
      type: String,
      default: '/images/user.png',
    },
    thumbnail: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    _color() {
      return this.color || this.getRandomColor(this.text)
    },
    _src() {
      if (this.thumbnail) {
        if (!this.src) return this.src
        const hasQuery = /\?/.test(this.src)
        return this.src + (hasQuery ? '&thumbnail' : '?thumbnail')
      }
      return this.src
    },
  },
  methods: {
    getRandomColor(source, a = 10) {
      return getRandomColor(source, a)
    },

    getFirstCharacterOfEachWordInString(str = '', length = 2) {
      if (str.length <= length) return str.toUpperCase()
      const matches = str
        .split(' ')
        .map((e) => e[0].toUpperCase())
        .filter((e) => e !== ' ')
      const acronym = matches.join('')
      return acronym.length > length ? acronym.slice(0, length) : acronym
    },
  },
}
</script>

<style lang="scss">
.app-entity-avatar {
  .el-avatar {
    img {
      width: 100%;
    }
  }
}
</style>
