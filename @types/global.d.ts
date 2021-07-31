import { ListContext } from '@nguyenduclong/mongodbts'
import { RuleItem } from 'async-validator'
import { ElCheckbox } from 'element-ui/types/checkbox'
import { ElDatePicker } from 'element-ui/types/date-picker'
import { ElDropdown } from 'element-ui/types/dropdown'
import { ElInput } from 'element-ui/types/input'
import { ElInputNumber } from 'element-ui/types/input-number'
import { ElSelect } from 'element-ui/types/select'
import { ElSwitch } from 'element-ui/types/switch'
import { ElTableColumn } from 'element-ui/types/table-column'
import { AnyObject } from 'mongoose'
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: {}
    }
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }

  export type FormItem = {
    label?: string
    key?: string
    placeholder?: string
    rules?: (RuleItem & AnyObject) | (RuleItem & AnyObject[])
  } & (
    | { type: 'slot'; props?: any }
    | { type: 'input'; props?: Partial<ElInput> }
    | { type: 'select'; props?: Partial<ElSelect> }
    | { type: 'input-number'; props?: Partial<ElInputNumber> }
    | { type: 'dropdown'; props?: Partial<ElDropdown> }
    | { type: 'datepicker'; props?: Partial<ElDatePicker> }
    | { type: 'switch'; props?: Partial<ElSwitch> }
    | { type: 'checkbox'; props?: Partial<ElCheckbox> }
    | { type: 'json'; props?: AnyObject }
    | {
        type: 'select-entity'
        props?: Partial<{
          value: any
          object: boolean
          items: any[]
          disabled: boolean
          valueKey: string
          transform: {
            get?: any
            set?: any
          }
          api: {
            method: 'get' | 'put' | 'post' | 'delete'
            dataProperty: string
          }
          payload: ListContext<any>
        }>
      }
  ) &
    AnyObject

  export type FormItems = FormItem[]

  export type ColumnItem = {
    columnProps?: Partial<ElTableColumn>
    label?: string
    prop?: string
    formatter?: 'date' | 'money' | 'number' | any[]
    render?: (data: any) => any | never | null
    isArray?: boolean
    type?: string
    props?: any
  } & (
    | {
        type?: 'tag'
      }
    | {
        type?: 'action'
        actions?: {
          visible: boolean | ((row: any) => boolean)
          action: 'create' | 'delete' | (string & {})
          text: string
          type: 'warning' | 'success' | 'primary' | 'info'
          onClick: ({ row, action }: { row: any; action: string }) => void
        }[]
      }
  )

  export interface DataTableProps {
    data: any[]
    endpoint: string
    elTable: any
    columns?: ColumnItem[]
    api: any
    payload: any
    emitActions: any[]
  }
}
