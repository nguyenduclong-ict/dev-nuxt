<script lang="tsx">
import Vue from 'vue'

export default Vue.component('Render', {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    data: {
      type: [String, Object, Number],
    },
    render: {
      type: [Function, String, Number] as any,
      default: null,
    },
  },

  render(h) {
    const view =
      typeof this.render === 'function'
        ? (this.render as any)(this.data, h)
        : this.render

    if (view?.constructor.name === 'VNode') return view
    return <this.tag>{view}</this.tag>
  },
})
</script>

<style scoped></style>
