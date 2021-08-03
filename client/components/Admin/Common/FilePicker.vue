<template>
  <div class="file-picker flex flex-col flex-wrap w-full gap-2">
    <div
      v-for="item in _files"
      :key="item.id"
      class="shadow mr-auto p-1 pl-2 flex items-center rounded"
      style="line-height: initial"
    >
      <i
        style="width: 14px"
        class="mr-1"
        :class="[
          item.status === 'ready'
            ? 'el-icon-upload2 text-primary'
            : item.status === 'success'
            ? 'el-icon-success text-success'
            : item.status === 'error'
            ? 'el-icon-error text-danger'
            : '',
        ]"
        @click="handleDeleteFile(item)"
      ></i>

      <el-link :href="item.url" target="_blank">
        {{ fileName(item) }}
      </el-link>

      <i
        class="
          ml-2
          cursor-pointer
          el-icon-delete
          text-danger
          p-1
          rounded
          hover:bg-gray-100
          active:bg-gray-200
        "
        @click="handleDeleteFile(item)"
      ></i>
    </div>
    <el-button
      v-if="
        (!multiple && !value) || (multiple && value && value.length < limit)
      "
      type="primary"
      icon="el-icon-plus"
      class="w-min"
      @click="handleShowSelectFile"
    >
      Chọn file
    </el-button>
    <input
      v-show="false"
      ref="fileInput"
      :multiple="multiple"
      :accept="accept"
      type="file"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import { createUniqueId, numeral, removeItems } from '@/utils'
import Vue from 'vue'

export default Vue.extend({
  name: 'FilePicker',
  props: {
    value: {
      type: [String, Array],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 10,
    },
    accept: {
      type: String,
    },
    autoupload: {
      type: Boolean,
      default: true,
    },
    object: {
      type: Boolean,
      default: false,
    },
    transform: {
      type: Function,
      default(res) {
        return this.object ? res : res?.url
      },
    },
  },

  data() {
    return {
      files: [],
    }
  },

  computed: {
    _files() {
      const files = []
      if (this.multiple && this.value) {
        ;(this.value as any).forEach((item) => {
          if (!item) return
          files.push(
            typeof item === 'string'
              ? {
                  id: createUniqueId(),
                  isValue: true,
                  url: item,
                  status: 'success',
                }
              : {
                  id: createUniqueId(),
                  ...item,
                  isValue: true,
                  status: 'success',
                }
          )
        })
      }

      if (!this.multiple && this.value) {
        files.push(
          typeof this.value === 'string'
            ? {
                id: createUniqueId(),
                url: this.value,
                isValue: true,
                status: 'success',
              }
            : {
                id: createUniqueId(),
                ...this.value,
                isValue: true,
                status: 'success',
              }
        )
      }

      this.files.forEach((item) => {
        files.push(item)
      })

      return files
    },
  },

  methods: {
    fileName(value) {
      if (!value) return ''
      if (typeof value === 'string') return value?.split('/').pop()

      if (typeof value === 'object') {
        return value.name || value.url?.split('/').pop()
      }
    },

    fileUrl(file: any) {
      return (
        file.url ||
        location.protocol + '//' + location.host + '/api/file/' + file.name
      )
    },

    handleShowSelectFile() {
      ;(this.$refs.fileInput as any).click()
    },

    handleFileChange(event) {
      if (
        this.multiple &&
        event.target.files.length + this.value.length > this.limit
      ) {
        this.$showMessage({
          type: 'warning',
          message: 'Bạn đã chọn nhiều hơn ' + this.limit + ' file',
        })
        event.target.files.splice(0, this.limit)
      }

      event.target.files.forEach((file, index) => {
        this.files.push({
          id: createUniqueId(),
          file,
          url: null,
          response: null,
          status: 'ready',
          progress: 0,
          size: file.size,
          name: file.name,
        })
      })
      if (this.autoupload) {
        this.handleUploadFile()
      }
      event.target.value = ''
    },

    async handleUploadFile() {
      const result: any[] = Array.from({
        length: this.files.filter((e) => e.status === 'ready').length,
      })

      await Promise.all(
        this.files
          .filter((e) => e.status === 'ready')
          .map((item, index) => {
            const formData = new FormData()
            formData.append('file', item.file)
            return this.$axios
              .$post('/api/upload', formData, {
                onUploadProgress({ loaded, total }) {
                  item.progress = +numeral(loaded / total).format('0,0.[0]')
                },
              })
              .then((res) => {
                res.url = this.fileUrl(res)
                item.status = 'success'
                item.response = res
                result[index] = item
              })
              .catch(() => {
                item.status = 'error'
              })
          })
      )

      if (this.multiple) {
        const value: any[] = (this.value as any) || []
        value.push(
          ...result.filter((e) => !!e).map((e) => this.transform(e.response))
        )
        this.$emit('input', value)
      } else {
        const res = result.find((e) => !!e)?.response
        if (res) this.$emit('input', this.transform(res))
      }

      removeItems(this.files, (e) => result.includes(e))
    },

    handleDeleteFile(item) {
      if (item.isValue && this.value) {
        if (this.multiple && Array.isArray(this.value)) {
          removeItems(this.value as any[], (e) =>
            typeof e === 'string' ? e === item.url : e?.url === item.url
          )
        } else {
          console.log('emit null')

          this.$emit('input', null)
        }
      }

      if (!item.isValue) {
        removeItems(this.files, (e) => e.id === item.id)
      }
    },
  },
})
</script>

<style scoped></style>
