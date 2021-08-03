<template>
  <div class="data-table">
    <el-table
      :data="data"
      fit
      style="width: 100%"
      highlight-current-row
      v-bind="elTable.props"
      @row-click="handleAction({ row: $event, action: 'row-click' })"
      v-on="elTable.props"
    >
      <el-table-column
        v-for="(column, index) in columns"
        v-bind="column.columnProps"
        :key="column.prop || index"
        :prop="column.prop"
        :label="column.label"
      >
        <template #default="{ row }">
          <slot
            v-if="column.type === 'slot'"
            :name="`column-${column.prop}`"
            :row="row"
          ></slot>
          <component
            :is="column.component"
            v-else-if="column.type === 'component'"
            v-bind="column.props"
          />
          <Cell v-else :column="column" :row="row" :render="column.render" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-2"
      :layout="
        ['sm', 'xs'].includes(responsive)
          ? 'total, sizes, ->, prev, pager, next'
          : 'total, sizes, ->, prev, pager, next, jumper'
      "
      :current-page="payload.page"
      :page-count="payload.totalPages"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="payload.pageSize"
      :total="payload.total"
      background
      @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script lang="ts">
import { get } from '@/utils/lodash'
import { removeItems } from '@/utils/utils'
import Vue from 'vue'
import { Accessors } from 'vue/types/options'
import { mapState } from 'vuex'
import Cell from './DataTable/Cell.vue'

const DataTable = Vue.extend({
  components: { Cell },
  provide: function () {
    return {
      // @ts-ignore
      dataTable: this,
    } as any
  } as any,
  props: {
    data: {
      type: Array,
      default: () => [] as any[],
    },
    endpoint: String,
    elTable: {
      type: Object,
      default: () => ({
        props: {},
        events: {},
      }),
    },
    columns: {
      type: Array,
      default: () => [] as any[],
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
    emitActions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      fetchedCounts: 0,
    }
  },

  computed: {
    ...mapState(['responsive']),
    _payload() {
      const { total, totalPages, ...payload } = (this as any).payload
      if (get(this, 'api.method') === 'get') {
        if (payload.query) payload.query = JSON.stringify(payload.query)
        if (payload.populates)
          payload.populates = JSON.stringify(payload.populates)
        if (payload.fields) payload.fields = JSON.stringify(payload.fields)
        if (payload.sort) payload.sort = JSON.stringify(payload.sort)
      }

      return payload
    },
  } as Accessors<{ _payload: any }>,

  created() {
    this.fetchData()
  },

  methods: {
    async fetchData(page = 1) {
      const { endpoint, api, _payload } = this

      if (page) {
        _payload.page = page
      }

      if (!endpoint) return

      const response = await this.$axios.$request({
        url: endpoint,
        method: api.method,
        params: api.method === 'get' ? _payload : undefined,
        data: api.method === 'post' ? _payload : undefined,
      })

      const data = api.dataProperty ? get(response, api.dataProperty) : response
      let pagination = {}
      if (api.dataProperty) {
        pagination = {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        }
      }

      if (this.fetchedCounts > 0) {
        this.data.splice(0)
      }

      this.data.push(...data)
      Object.assign(this.payload, pagination)
      this.fetchedCounts++
    },

    async handleAction({ row, action }: { row: any; action: any }) {
      console.log('handleAction', row, action)
      if (this.emitActions.includes(action)) {
        this.$emit(action, row)
        return
      }

      if (action === 'delete') {
        const continueAction = await this.$confirm(
          this.$t('Bạn có muốn xóa dòng này?') as string,
          this.$t('Chú ý') as string,
          {
            type: 'warning',
          }
        )

        if (continueAction) {
          const endpoint = this.getApiConfig(row).deleteEndpoint
          try {
            const result = await this.$axios.delete(endpoint)
            console.log(result)
            removeItems(this.data, row, 'id')
            this.$showMessage({
              message: this.$t('Xóa thành công') as string,
              type: 'success',
            })
          } catch (error) {
            console.error(error)
            this.$showError(error)
          }
        }
      } else {
        this.$emit(action, row)
      }
    },

    getApiConfig(row: any) {
      return {
        // fetch data
        endpoint: this.endpoint,
        method: 'get',
        dataProperty: 'data',
        // delete
        methodDelete: 'delete',
        deleteEndpoint: this.endpoint + '/' + row.id,
        // update
        updateMethod: 'put',
        updateEndpoint: this.endpoint + '/' + row.id,
        ...(this.api as {}),
      }
    },

    handlePageChange(page) {
      this.fetchData(page)
    },
  },
})

export type Props = InstanceType<typeof DataTable>['__props']

export default DataTable
</script>

<style scoped></style>
