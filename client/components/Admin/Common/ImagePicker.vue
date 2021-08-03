<template>
  <div class="file-picker flex flex-col flex-wrap w-full gap-2">
    <div
      v-for="item in _files"
      :key="item.id"
      class="shadow mr-auto p-1 pl-2 flex items-center rounded"
      style="line-height: initial"
    >
      <el-image
        v-if="item.status === 'success'"
        class="mr-2 object-cover flex-none"
        :preview-src-list="[fileUrl(item)]"
        style="width: 32px; height: 32px"
        :src="fileUrl(item)"
      >
      </el-image>
      <i
        v-else
        style="width: 14px"
        class="mr-2 flex-none"
        :class="[
          item.status === 'ready'
            ? 'el-icon-upload2 text-primary'
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
      Thêm ảnh
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
import Vue from 'vue'
import FilePicker from './FilePicker.vue'

export default Vue.extend({
  name: 'ImagePicker',
  extends: FilePicker,
})
</script>

<style scoped></style>
