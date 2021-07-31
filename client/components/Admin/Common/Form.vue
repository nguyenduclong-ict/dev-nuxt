<template>
  <component
    :is="formComponent"
    ref="form"
    :model="model"
    @keydown.enter.native.stop.prevent="$emit('enter')"
  >
    <template v-for="(item, index) in items">
      <slot
        v-if="item.type === 'slot'"
        :name="item.key"
        :item="item"
        :model="model"
        :items="items"
      ></slot>
      <el-form-item
        v-else
        :key="item.key || index"
        v-bind="item.formItemProps"
        :label="item.label"
        :rules="item.rules"
        :prop="item.key"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="model[item.key]"
          v-bind="item.props"
          :placeholder="item.placeholder"
        ></el-input>
        <el-checkbox
          v-else-if="item.type === 'checkbox'"
          v-model="model[item.key]"
          v-bind="item.props"
        />
        <el-date-picker
          v-else-if="item.type === 'datepicker'"
          v-model="model[item.key]"
          v-bind="item.props"
        />
        <JsonEditor
          v-else-if="item.type === 'json'"
          v-model="model[item.key]"
          v-bind="item.props"
        />
        <SelectEntity
          v-else-if="item.type === 'select-entity'"
          v-model="model[item.key]"
          v-bind="item.props"
        />
      </el-form-item>
    </template>
  </component>
</template>

<script>
import Vue from 'vue'
import JsonEditor from './JsonEditor.vue'
import SelectEntity from './SelectEntity.vue'

export default Vue.extend({
  components: { SelectEntity, JsonEditor },
  props: {
    model: {
      type: Object,
    },
    items: {
      type: Array,
      default: () => [],
    },
    formComponent: {
      type: String,
      default: 'elForm',
    },
  },

  methods: {
    validate() {
      if (this.formComponent === 'elForm') {
        console.log(this.$refs.form)
        return this.$validateElForm(this.$refs.form)
      }

      return true
    },

    clearValidate() {
      return this.$clearElFormValidate(this.$refs.form)
    },
  },
})
</script>

<style lang="scss" scoped></style>
