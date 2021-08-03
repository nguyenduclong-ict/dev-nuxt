<template>
  <div
    class="tinymce-editor"
    :style="{
      '--toolbar-size': { small: '24px', normal: '34px' }[toolbarSize],
    }"
  >
    <editor v-model="_value" :init-value="value" :init="init" />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { fileUrl } from '@/utils'

export default {
  name: 'TinymceEditor',
  components: {
    editor: Editor,
  },

  props: {
    value: String,
    toolbarSize: {
      validator: (v) => v === 'small' || v === 'normal',
      default: 'small',
    },
    placeholder: String,
  },

  data() {
    return {
      init: {
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount a11ychecker tabfocus',
        ],
        toolbar: [
          'undo redo | table | formatselect | bold italic backcolor | ',
          'alignleft aligncenter alignright alignjustify| ',
          'bullist numlist outdent indent | removeformat | image | help fullscreen',
        ].join(''),
        toolbar_mode: 'wrap',
        lists_indent_on_tab: true,
        content_css: '/css/tinymce.css',
        // Image
        images_upload_handler: this.imageUploadHandler,
        image_caption: true,
        image_advtab: true,
        a11y_advanced_options: true,
        resize_img_proportional: false,
        paste_data_images: true,
        image_dimensions: false,
        automatic_uploads: true,
        file_picker_callback: this.filePickerHandler,
        image_class_list: [
          { title: 'Width: 100%', value: 'image__w-full' },
          { title: 'Width: 50%', value: 'image__w-50pt' },
          { title: 'Width: auto', value: 'image__w-auto' },
        ],
        setup: (editor) => {
          this.editor = editor
          editor.on('ObjectResized', this.handleImageResized)
          editor.on('keydown', this.handleEditorKeydown)
        },
        init_instance_callback: (editor) => {
          editor.contentAreaContainer
            .querySelector('iframe')
            .contentDocument.addEventListener(
              'dblclick',
              this.handleEditorContainerDblclick
            )
        },
        placeholder: this.placeholder,
        // Image
        branding: false,
        elementpath: false,
        statusbar: true,
      },
      editor: null,
      previewKeyDown: null,
    }
  },

  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        return this.$emit('input', v)
      },
    },
  },

  methods: {
    imageUploadHandler(blobInfo, success, failure, progress) {
      const onError = (error) => failure(error.message)
      const formData = new FormData()
      formData.append('file', blobInfo.blob())

      this.$axios
        .$post('/api/upload', formData, progress, onError)
        .then((fileResponses) => {
          success(fileUrl(fileResponses))
        })
    },

    handleImageResized(e) {
      e.target.classList.value = e.target.classList.value.replace(
        /(^| )image__w-\w*/g,
        ''
      )

      e.target.classList.add('resized')
    },

    handleEditorContainerDblclick(e) {
      if (e.target.tagName === 'IMG') {
        window.open(e.target.getAttribute('src'), '_blank')
      }
    },

    handleEditorKeydown(e) {
      if (e.code === 'Tab' && this.previewKeyDown === 'Minus') {
        // this.editor.execCommand('InsertDefinitionList', false)
        // this.editor.execCommand('InsertDefinitionList', false)
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertOrderedList', false, {
            'list-style-type': 'decimal',
          })
        })
      } else if (e.code === 'Tab' && this.previewKeyDown === 'Period') {
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertUnorderedList', true, {
            'list-style-type': 'disc',
          })
        })
      }
      this.previewKeyDown = e.code
    },
  },
}
</script>

<style lang="scss">
.tox-notifications-container {
  display: none;
}

.tox.tox-silver-sink.tox-tinymce-aux {
  z-index: 3000;
}

.tinymce-editor {
  width: 100%;
  display: inline-block;
  .tox-toolbar__primary {
    background: #fff !important;
    border-bottom: solid 1px #ccc !important;

    .tox-tbtn {
      height: var(--toolbar-size);
    }
  }
}
</style>
