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
        (!multiple && !value) ||
        (multiple && (!value || (value && value.length < limit)))
      "
      type="primary"
      icon="el-icon-plus"
      class="w-min"
      @click="handleShowGallery"
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

    <el-dialog
      :visible.sync="isShowGallery"
      custom-class="gallery-dialog-wrapper"
      class="gallery-dialog"
      append-to-body
      title="Chọn file"
    >
      <Gallery
        ref="gallery"
        :multiple="multiple"
        :limit="multiple ? (value ? limit - value : limit) : 1"
      />

      <div slot="footer" class="flex justify-center items-center">
        <el-button @click="closeDialog">Hủy</el-button>
        <el-button type="success" @click="handleSuccess">Xác nhận</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { createUniqueId, numeral } from '@/utils'
import Vue from 'vue'
import FilePicker from './FilePicker.vue'
import Gallery from './Gallery.vue'

export default Vue.extend({
  name: 'GalleryPicker',
  components: { Gallery },
  extends: FilePicker,

  data() {
    return {
      isShowGallery: false,
    }
  },

  computed: {
    _files(this: any) {
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

      return files
    },
  },

  watch: {
    isShowGallery(state) {
      if (state) (this.$refs.gallery as any)?.fetchMedias()
    },
  },

  methods: {
    handleSuccess() {
      const selectedFiles = (this.$refs.gallery as any).selectedItems

      const values = []

      selectedFiles.forEach((item) => {
        item.url = (this as any).fileUrl(item)
        if (item.thumbnail) {
          let [w, h] = item.thumbnail.split('x')
          w = +w
          h = +h
          let thumbnail = item.thumbnails?.find((e) => {
            return e.width === w && w.height === h
          })
          if (!thumbnail) {
            thumbnail = {
              url: item.url + '?thumbnail=' + item.thumbnail,
            }
          } else {
            thumbnail.name = thumbnail.path
            thumbnail.url = (this as any).fileUrl(thumbnail)
          }
          values.push((this as any).transform(thumbnail))
        } else {
          values.push((this as any).transform(item))
        }
      })

      if ((this as any).multiple) {
        this.$emit('input', [...((this as any).value || []), ...values])
      } else {
        this.$emit('input', values[0])
      }

      this.closeDialog()
    },

    closeDialog() {
      this.isShowGallery = false
      ;(this.$refs.gallery as any).selectedItems = []
      ;(this.$refs.gallery as any).selected = null
    },

    handleShowGallery() {
      this.isShowGallery = true
    },
  },
})
</script>

<style lang="scss">
.gallery-dialog {
  display: flex;

  .gallery-dialog-wrapper {
    margin-top: auto !important;
    margin-bottom: auto !important;
    @apply w-full sm:max-w-screen-sm md:max-w-screen-lg;

    .el-dialog__body {
      overflow: hidden;
      .list-media {
        max-height: calc(95vh - 55px - 60px - 60px - 32px - 8px);
        overflow-y: auto;
      }
    }

    .file-detail {
      max-height: calc(95vh - 55px - 60px - 60px - 32px - 8px);
      min-height: 50vh;
      overflow-y: auto;
    }
  }
}
</style>
