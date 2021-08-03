<template>
  <div class="gallery">
    <div class="gallery-header w-full flex justify-end mb-2">
      <div v-if="selectedItems.length > 0" class="flex-1">
        <span> Đã chọn {{ selectedItems.length }} </span>
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="handleDeleteSelectedItems"
        >
          Xóa {{ selectedItems.length }} tệp
        </el-button>
      </div>
      <Upload v-if="medias.length" @success="onUploadSuccess" />
    </div>

    <div class="gallery-content flex gap-2">
      <div
        v-if="medias.length"
        class="
          list-media
          flex flex-wrap
          gap-2
          overflow-y-auto
          scrollbar
          mb-auto
          flex-1
        "
      >
        <div
          v-for="media in medias"
          :key="media.id"
          class="
            media
            w-24
            overflow-hidden
            cursor-pointer
            border-4 border-transparent
          "
          @click="handleMediaClick(media)"
        >
          <div
            v-if="isImage(media)"
            style="width: 100%; aspect-ratio: 1/1"
            class="overflow-hidden border-4 border-transparent"
            :class="{ 'border-primary': isSelected(media) }"
          >
            <el-image
              :src="fileUrl(media)"
              fit="cover"
              style="width: 100%; height: 100%"
              :alt="fileName(media)"
              lazy
            ></el-image>
          </div>
          <div
            v-else
            style="width: 100%; aspect-ratio: 1/1"
            class="flex justify-center items-center bg-gray-100"
          >
            <i class="el-icon-document text-3xl"></i>
          </div>
          <div class="mt-1 truncate font-semibold">{{ fileName(media) }}</div>
        </div>
      </div>
      <div
        v-else
        class="
          h-48
          w-full
          flex flex-col
          justify-center
          items-center
          border-2 border-dashed border-gray-500
          rounded-lg
        "
      >
        <Upload @success="onUploadSuccess" />
        <div class="text-gray-500 mt-2">
          Không có tệp nào, nhấn tải lên để thêm tệp
        </div>
      </div>
      <div class="h-auto bg-gray-300" style="width: 1px"></div>
      <div
        class="
          file-detail
          scrollbar
          w-64
          flex-none
          px-2
          flex flex-col
          overflow-x-hidden
        "
      >
        <template v-if="selected">
          <div class="content flex-1">
            <div v-if="isImage(selected)" class="overflow-hidden">
              <el-image
                :preview-src-list="[fileUrl(selected)]"
                :src="fileUrl(selected)"
                fit="cover"
                style="width: 100%; aspect-ratio: 1/1"
                :alt="fileName(selected)"
                lazy
              ></el-image>

              <div class="flex flex-wrap gap-2 mt-2">
                <div>
                  <el-image
                    class="cursor-pointer border-2 border-transparent"
                    :class="{
                      'border-primary': selected.thumbnail === '128x128',
                    }"
                    :src="fileUrl(selected) + '?thumbnail=512x512'"
                    fit="cover"
                    style="width: 64px; height: 64px"
                    :alt="fileName(selected)"
                    lazy
                    @click="handleThumbnailClick('128x128')"
                  ></el-image>
                  <div>128 x 128</div>
                </div>

                <div>
                  <el-image
                    class="cursor-pointer border-2 border-transparent"
                    :class="{
                      'border-primary': selected.thumbnail === '512x512',
                    }"
                    :src="fileUrl(selected) + '?thumbnail=512x512'"
                    fit="cover"
                    style="width: 64px; height: 64px"
                    :alt="fileName(selected)"
                    lazy
                    @click="handleThumbnailClick('512x512')"
                  ></el-image>
                  <div>512 x 512</div>
                </div>
              </div>
            </div>
            <div
              v-else
              style="width: 100%; aspect-ratio: 1/1"
              class="flex justify-center items-center bg-gray-100"
            >
              <i class="el-icon-document text-3xl"></i>
            </div>
            <el-link :href="fileUrl(selected)" target="_blank" class="mt-2">
              {{ fileName(selected) }}
            </el-link>
            <div class="font-bold">{{ selected.size | number('0.[0] b') }}</div>
          </div>

          <div class="flex justify-center items-center mt-2">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete"
            >
              Xóa
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { buildParams } from '@/utils/client'
import { removeItems } from '@/utils'
import Vue from 'vue'
import Upload from './Upload.vue'

export default Vue.extend({
  components: { Upload },
  props: {
    multiple: {
      type: Boolean,
    },

    limit: {
      type: Number,
    },
  },

  data() {
    return {
      isShowGallery: false,
      medias: [],
      page: 1,
      pageSize: 100,
      total: 0,
      totalPages: 1,
      fetching: false,
      selectedItems: [],
      selected: null,
    }
  },

  created() {
    this.fetchMedias()
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

    isImage(media) {
      return media.mimetype && media.mimetype.startsWith('image')
    },

    isSelected(media) {
      return this.selectedItems.includes(media)
    },

    handleThumbnailClick(size) {
      if (this.selected.thumbnail === size) {
        this.selected.thumbnail = null
      } else {
        this.selected.thumbnail = size
      }
    },

    handleMediaClick(media) {
      media.thumbnail = media.thumbnail || null
      const index = this.medias.indexOf(media)
      this.$set(this.medias, index, media)

      if (this.selectedItems.includes(media)) {
        removeItems(this.selectedItems, (e) => e === media)
        this.selected = null
      } else if (this.multiple && this.selectedItems.length < this.limit) {
        this.selectedItems.push(media)
        this.selected = media
      } else {
        this.selectedItems = [media]
        this.selected = media
      }
    },

    async fetchMedias(_page = 1) {
      this.fetching = true
      try {
        const { data, page, pageSize, total, totalPages } =
          await this.$axios.$get('/api/entity/files', {
            params: buildParams.list({
              page: _page,
              pageSize: this.pageSize,
            }),
          })

        this.page = page
        this.pageSize = pageSize
        this.total = total
        this.totalPages = totalPages
        data.forEach((item) => {
          if (!item.thumbnail) {
            item.thumbnail = null
          }
        })
        if (page > 1) {
          removeItems(data, (e: any) =>
            this.medias.find((media) => media.id === e.id)
          )

          this.medias.push(...data)
        } else {
          this.medias = data
        }
      } catch (error) {
        console.error(error)
      }
      this.fetching = false
    },

    onUploadSuccess(files) {
      files.forEach((file) => {
        file.thumbnail = file.thumbnail || null
      })
      this.medias.unshift(...files)
    },

    async handleDelete() {
      try {
        await this.$confirm('Bạn chắc chắn muốn xóa file này?', {
          type: 'warning',
          title: 'Lưu ý',
        })

        const rs = await this.$axios.$delete(
          '/api/entity/files/' + this.selected.id
        )
        console.log(rs)
        removeItems(this.medias, (e) => e === this.selected)
        removeItems(this.selectedItems, (e) => e === this.selected)
        this.selected = null
      } catch (error) {
        console.error(error)
      }
    },

    async handleDeleteSelectedItems() {
      try {
        await this.$confirm(
          `Bạn chắc chắn muốn xóa ${this.selectedItems.length} tệp?`,
          {
            type: 'warning',
            title: 'Lưu ý',
          }
        )
        const rs = await this.$axios.$delete('/api/entity/files', {
          data: buildParams({
            query: {
              id: {
                $in: this.selectedItems.map((e) => e.id),
              },
            },
          }),
        })
        console.log(rs)
        removeItems(this.medias, (e) => this.selectedItems.includes(e))
        this.selectedItems = []
        this.selected = null
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>

<style scoped></style>
