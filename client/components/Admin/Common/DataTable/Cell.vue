<script lang="tsx">
import Vue from 'vue'
import { get } from '@/utils/lodash'
import { isVNode } from '@/utils/client/validate'

export default Vue.extend({
  inject: {
    dataTable: {
      default: null,
    },
  },

  props: {
    column: {
      type: Object,
      default: null,
    },
    row: { type: Object, default: null },
    render: {
      type: Function,
    },
  },

  methods: {
    getFilterFromFormatter(formatter: any): { name?: string; args?: any[] } {
      if (!formatter) return {}
      if (typeof formatter === 'string') {
        return { name: formatter, args: [] }
      }
      if (Array.isArray(formatter)) {
        const [name, ...args] = formatter
        return { name, args }
      }

      return {}
    },

    getValue(rawValue, row, formatter): any {
      let value = rawValue
      if (formatter) {
        if (typeof formatter === 'function') {
          value = formatter(rawValue, row)
        } else {
          const { name, args } = this.getFilterFromFormatter(formatter)
          if (name && this.$options?.filters?.[name]) {
            value = this.$options.filters[name](rawValue, ...(args as any))
          }
        }
      }
      return value
    },
  },

  render() {
    if (this.render) {
      const view = this.render(this.row)
      return isVNode(view) ? view : <div>{view}</div>
    }
    const { column, row } = this
    const props =
      typeof column.props === 'function'
        ? column.props(row, column)
        : column.props

    const renderByType = (type: any, val: any, index = 0) => {
      switch (type) {
        case 'tag':
          return (
            <el-tag
              type={val ? 'primary' : 'info'}
              size="small"
              {...props}
              key={index}
            >
              {String(val)}
            </el-tag>
          )
      }
    }

    if (column.type === 'action') {
      const actions = column.actions || []
      return (
        <div class="flex flex-wrap gap-1">
          {actions.map((action: any) => {
            if (!action) return null
            if (
              action.visible === false ||
              (typeof action.visible === 'function' && !action.visible(row))
            ) {
              return null
            }

            const types: any = { edit: 'primary', delete: 'danger' }

            const onClick = (e) => {
              e.stopPropagation()
              if (action.onClick)
                action.onClick({
                  row,
                  action: typeof action === 'string' ? action : action.action,
                })
              else
                (this as any).dataTable?.handleAction({
                  row,
                  action: typeof action === 'string' ? action : action.action,
                })
            }

            if (typeof action === 'string') {
              return (
                <el-button
                  style="margin: 0;"
                  type={types[action] || 'primary'}
                  size="mini"
                  onClick={onClick}
                >
                  {this.$t(action)}
                </el-button>
              )
            }
            return (
              <el-button
                style="margin: 0;"
                type={action.type || types[action.action] || 'primary'}
                size="mini"
                {...action}
                onClick={onClick}
              >
                {this.$t(action.text || action.action)}
              </el-button>
            )
          })}
        </div>
      )
    }

    const rawValue = get(row, column.prop)

    if (column.type) {
      if (column.isArray) {
        return (
          <span class="flex flex-wrap gap-1">
            {(rawValue || []).map((item, index) =>
              renderByType(
                column.type,
                this.getValue(item, row, column.formatter),
                index
              )
            )}
          </span>
        )
      }
      return renderByType(
        column.type,
        // @ts-ignore
        this.getValue(rawValue, row, column.formatter),
        0
      )
    }

    return <span>{this.getValue(rawValue, row, column.formatter)}</span>
  },
})
</script>

<style scoped></style>
