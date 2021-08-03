<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @mousedown.self="handleWrapMouseDown"
      @mouseup.self="handleWrapMouseUp"
    >
      <div
        :key="key"
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog',
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass,
        ]"
        :style="style"
      >
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            v-if="showClose"
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div v-if="rendered" class="el-dialog__body"><slot></slot></div>
        <div v-if="$slots.footer" class="el-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Dialog } from 'element-ui'
export default {
  extends: Dialog,
  data() {
    return {
      mounseDownPos: {
        x: 0,
        y: 0,
      },
    }
  },
  methods: {
    handleWrapMouseDown(e) {
      this.mounseDownPos.x = e.x
      this.mounseDownPos.y = e.y
    },
    handleWrapMouseUp(e) {
      if (
        Math.abs(e.x - this.mounseDownPos.x) < 10 &&
        Math.abs(e.y - this.mounseDownPos.y) < 10
      ) {
        this.handleWrapperClick()
      }
    },
  },
}
</script>
