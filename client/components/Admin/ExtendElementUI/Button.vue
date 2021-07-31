<script lang="ts">
import Vue from 'vue'
import { Button } from 'element-ui'

export default Vue.extend({
  extends: Button,

  props: {
    size: {
      type: String,
      default: 'small',
    },
  },
})
</script>

<style scoped></style>
