<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-upload"
      class="w-min"
      @click="handleShowSelectFile"
    >
      Tải lên
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
import { createUniqueId, numeral } from '@/utils'
import Vue from 'vue'

export default Vue.extend({
  name: 'Upload',
  props: {
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
  },

  data() {
    return {
      files: [],
    }
  },

  methods: {
    fileName(value) {
      if (!value) return ''
      if (typeof value === 'string')
        return value?.split('/').pop().replace(/\?.*$/, '')

      if (typeof value === 'object') {
        return value.name || value.url?.split('/').pop().replace(/\?.*$/, '')
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
      if (this.multiple && event.target.files.length > this.limit) {
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

      this.$emit(
        'success',
        result.filter((e) => !!e).map((e) => e.response)
      )
    },
  },
})
</script>

<style scoped></style>
