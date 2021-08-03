<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      jsonEditor: false,
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    },
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'application/json',
      theme: 'base16-dark',
    })
    this.jsonEditor.setValue(JSON.stringify(this.value || null, null, 2))
    this.jsonEditor.on('change', (cm) => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
  },
}
</script>

<style lang="scss">
.json-editor {
  height: 100%;
  position: relative;
  display: inline-block;

  .CodeMirror-line {
    line-height: 16px !important;
  }
}
</style>
