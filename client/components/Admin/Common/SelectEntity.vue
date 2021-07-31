<template>
  <el-select
    v-model="_value"
    :disabled="disabled"
    :multiple="multiple"
    :value-key="object ? valueKey : undefined"
    v-bind="elSelect.props"
    v-on="elSelect.events"
  >
    <el-option
      v-for="(item, index) in items"
      :key="_transform.value(item) + index"
      :value="_transform.value(item)"
      :label="_transform.label(item)"
    >
      <Render :render="_transform.content" :data="item" />
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { get } from '@/utils/lodash'
import Vue from 'vue'
import Render from './Render.vue'

export default Vue.extend({
  components: { Render },
  props: {
    value: {
      type: [Object, Array, String, Number] as any,
    },
    items: { type: Array, default: (): any[] => [] },
    object: {
      type: Boolean,
      default: false,
    },
    elSelect: {
      type: Object,
      default: () => ({
        props: {},
        events: {},
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: { type: Boolean, default: false },
    endpoint: String,
    labelKey: {
      type: String,
      default: 'name',
    },
    valueKey: { type: String, default: 'id' },
    transform: {
      type: Object,
    },
    api: {
      type: Object,
      default: () => ({
        method: 'get',
        dataProperty: 'data',
      }),
    },
    payload: {
      type: Object,
      default: () => ({
        query: {},
        page: 1,
        pageSize: 10,
      }),
    },
  },

  data() {
    return {
      count: {
        fetch: 0,
      },
    }
  },

  computed: {
    _payload(): any {
      const payload = { ...get(this, 'payload') }
      if (get(this, 'api.method') === 'get') {
        if (payload.query) payload.query = JSON.stringify(payload.query)
        if (payload.populates)
          payload.populates = JSON.stringify(payload.populates)
        if (payload.fields) payload.fields = JSON.stringify(payload.fields)
        if (payload.sort) payload.sort = JSON.stringify(payload.sort)
      }

      return payload
    },

    _value: {
      get(): any {
        return this.value
      },
      set(value: any): any {
        this.$emit('input', value)
      },
    } as any,

    _transform(): { value: any; label: any; content: any } {
      const label =
        this.transform?.label ||
        ((v: any) => (this.labelKey ? get(v, this.labelKey) : v))
      const value =
        this.transform?.value ||
        ((v: any) =>
          this.object ? v : this.valueKey ? get(v, this.valueKey) : v)

      const content = this.transform?.content || label

      return {
        value,
        label,
        content,
      }
    },
  },

  created() {
    this.fetchItems()
  },

  methods: {
    async fetchItems() {
      if (!this.endpoint) return
      const { endpoint, api, _payload } = this

      const response = await this.$axios.$request({
        url: endpoint,
        method: api.method,
        params: api.method === 'get' ? _payload : undefined,
        data: api.method === 'post' ? _payload : undefined,
      })

      const data = api.dataProperty ? get(response, api.dataProperty) : response

      if (this.count.fetch > 0) {
        this.items.splice(0)
      }

      this.items.push(...data)
      this.count.fetch++
    },
  },
})
</script>

<style scoped></style>
