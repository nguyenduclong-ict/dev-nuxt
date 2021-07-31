<template>
  <div class="page">
    <div class="page-header">
      <div class="text-3xl">
        {{ entity.name }}
      </div>
      <div class="flex-1"></div>
      <div class="my-auto">
        <el-button type="primary" @click="handleShowCreate">
          {{ $t('Thêm ' + entity.name) }}
        </el-button>
      </div>
    </div>
    <div class="page-content">
      <DataTable v-bind="table" />
    </div>

    <el-dialog
      :visible.sync="isShowRawJson"
      :title="`Chi tiết ${entity.name}`"
      append-to-body
    >
      <VueJsonPretty v-if="selectedRow" :data="selectedRow"></VueJsonPretty>
      <div slot="footer" class="flex justify-center">
        <el-button type="primary" @click="copyObject(selectedRow)">
          Copy
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowDialogCreate"
      :title="`Thêm ${entity.name}`"
      append-to-body
      custom-class="crud-dialog-create"
      class="crud-dialog-create-wrapper"
      @close="dataCreate = null"
    >
      <Form
        v-if="dataCreate"
        ref="formCreate"
        :model="dataCreate"
        :items="formCreateItems"
      />

      <div slot="footer" class="flex justify-center">
        <el-button @click="isShowDialogCreate = false">
          {{ $t('Hủy') }}
        </el-button>
        <el-button type="success" @click="handleCreate">
          {{ $t('Xác nhận') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowDialogUpdate"
      :title="`Thêm ${entity.name}`"
      append-to-body
      custom-class="crud-dialog-create"
      class="crud-dialog-create-wrapper"
      @close="dataUpdate = null"
    >
      <Form
        v-if="dataUpdate"
        ref="formUpdate"
        :model="dataUpdate"
        :items="formEditItems"
      />

      <div slot="footer" class="flex justify-center">
        <el-button @click="isShowDialogUpdate = false">
          {{ $t('Hủy') }}
        </el-button>
        <el-button type="success" @click="handleUpdate">
          {{ $t('Lưu') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { EntityDeclaration, SchemaField } from '@/server/helpers/repository'
import { cloneDeep, get } from '@/utils/lodash'
import { removeItems, replace } from '@/utils/utils'
import { RuleItem } from 'async-validator'
import { ElInput } from 'element-ui/types/input'
import Vue from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import DataTable from '~/components/Admin/Common/DataTable.vue'
import Form from '~/components/Admin/Common/Form.vue'
import { buildParams } from '~/utils/client'

interface Data {
  entity: EntityDeclaration | null
  table: DataTableProps | null
  selectedRow: any
  isShowRawJson: boolean
  isShowDialogUpdate: boolean
  isShowDialogCreate: boolean
  dataCreate: any
  dataUpdate: any
  formCreateItems: FormItems | null
  formEditItems: FormItems | null
}

export default Vue.extend({
  components: { DataTable, VueJsonPretty, Form },

  asyncData({ store, route }): Data {
    const entity = store.state.admin.entities.find(
      (item) => item.id === route.params.id
    )

    return {
      entity,
    } as any
  },

  data(): Data {
    return {
      selectedRow: null,
      isShowRawJson: false,
      table: null,
      entity: null,
      isShowDialogUpdate: false,
      isShowDialogCreate: false,
      dataCreate: null,
      dataUpdate: null,
      formCreateItems: null,
      formEditItems: null,
    }
  },

  created() {
    this.initTable()
    this.getFormCreateItems()
    this.getFormUpdateItems()
  },

  methods: {
    copyObject(data) {
      this.$copyClipboard(JSON.stringify(data, null, 2))
    },
    async handleCreate() {
      const valid = await (this.$refs.formCreate as any).validate()

      if (valid) {
        try {
          const data = await this.$axios.$post(
            this.entity?.endpoint,
            buildParams.create({
              data: this.dataCreate,
              populates: this.table.payload.populates,
            })
          )

          if (data) {
            this.$showMessage({
              message: 'Tạo thành công',
              type: 'success',
            })
            this.table.data.unshift(data)
          }
          this.isShowDialogCreate = false
        } catch (error) {
          this.$showError(error)
        }
      }
    },
    getComponentFormField(field: SchemaField, key: string) {
      let type
      let props = {}
      const options: any = {}

      switch (field.type) {
        case 'String':
          if (field.enum) {
            type = 'select-entity'
            props = {
              multiple: false,
              items: field.enum.map((e) => ({ id: e, name: e })),
            }
          } else {
            type = 'input'
            props = {
              minlength: field.minlength,
              maxlength: field.maxlength,
            } as ElInput
          }
          break

        case 'Number':
          if (field.enum) {
            type = 'select-entity'
            props = {
              multiple: false,
              items: field.enum.map((e) => ({ value: e, label: e })),
            }
          } else {
            type = 'input-number'
            props = {
              min: field.min,
              max: field.max,
            } as ElInput
          }
          break

        case 'Boolean':
          type = 'checkbox'
          options.label = ''
          props = {
            label: field.label || key,
          }
          break

        case 'Date':
          type = 'datepicker'
          break

        case 'Mixed':
          type = 'json'
          props = {
            style: 'width: 100%;',
          }
          break

        case 'ObjectId':
          type = 'select-entity'
          props = {
            endpoint: this.$store.state.admin.entities.find(
              (e) => e.id === field.ref
            )?.endpoint,
            multiple: field.isArray,
            style: {
              width: '100%',
            },
          }
          break

        default:
          break
      }
      return { type, props, ...options }
    },
    handleShowCreate() {
      this.initFormCreate()
      this.isShowDialogCreate = true
    },
    getFormCreateItems() {
      const items: FormItems = []
      Object.keys(this.entity.schema).forEach((key) => {
        const field = this.entity.schema[key]

        let required = field.required

        if (field.auto) return

        const rules: RuleItem[] = []

        if (required) rules.push({ required: true })

        if (field.isArray) {
          rules.push({
            type: 'array',
            min: field.minlength,
            max: field.maxlength,
          })
        } else {
          field.validate?.forEach((item) => {
            switch (item.name) {
              case 'isOptional':
                if (!rules.find((item) => item.required === false))
                  rules.unshift({ required: false })

                required = false
                break
              case 'isBoolean':
                rules.push({
                  type: 'boolean',
                })
                break
              case 'isString':
                rules.push({
                  type: 'string',
                  min: field.validate.find((e) => e.name === 'minLength')
                    ?.constraints[0],
                  max: field.validate.find((e) => e.name === 'maxLength')
                    ?.constraints[0],
                })
                break
              case 'isNumber':
                rules.push({
                  type: 'number',
                  min: field.validate.find((e) => e.name === 'min')
                    ?.constraints[0] as number,
                  max: field.validate.find((e) => e.name === 'max')
                    ?.constraints[0],
                })
                break

              default:
                break
            }
          })
        }

        items.push({
          label: field.label || key,
          placeholder: field.label || key,
          required,
          key,
          rules,
          ...this.getComponentFormField(field, key),
        } as FormItem)
      })
      this.formCreateItems = items
    },

    getFormUpdateItems() {
      const items: FormItems = []
      Object.keys(this.entity.schema).forEach((key) => {
        const field = this.entity.schema[key]

        let required = field.required

        if (field.auto) return

        const rules: RuleItem[] = []

        if (required) rules.push({ required: true })

        if (field.isArray) {
          rules.push({
            type: 'array',
            min: field.minlength,
            max: field.maxlength,
          })
        } else {
          field.validate?.forEach((item) => {
            switch (item.name) {
              case 'isOptional':
                if (!rules.find((item) => item.required === false))
                  rules.unshift({ required: false })

                required = false
                break
              case 'isBoolean':
                rules.push({
                  type: 'boolean',
                })
                break
              case 'isString':
                rules.push({
                  type: 'string',
                  min: field.validate.find((e) => e.name === 'minLength')
                    ?.constraints[0],
                  max: field.validate.find((e) => e.name === 'maxLength')
                    ?.constraints[0],
                })
                break
              case 'isNumber':
                rules.push({
                  type: 'number',
                  min: field.validate.find((e) => e.name === 'min')
                    ?.constraints[0],
                  max: field.validate.find((e) => e.name === 'max')
                    ?.constraints[0],
                })
                break

              default:
                break
            }
          })
        }

        items.push({
          label: field.label || key,
          placeholder: field.label || key,
          required,
          key,
          rules,
          ...this.getComponentFormField(field, key),
        } as FormItem)
      })
      this.formEditItems = items
    },
    initFormCreate() {
      const data = {}
      this.formCreateItems.forEach((item) => {
        switch (item.type) {
          case 'checkbox':
            data[item.key] = false
            break

          case 'input-number':
            data[item.key] = 0
            break

          case 'input':
            data[item.key] = ''
            break

          case 'datepicker':
            data[item.key] = new Date()
            break

          case 'select-entity':
            data[item.key] = item.isArray
              ? []
              : item.required
              ? item.enum[0]
              : null
            break

          case 'json':
            data[item.key] = item.required ? item.enum[0] : null
            break

          default:
            break
        }
      })

      this.dataCreate = data
    },
    initTable() {
      const payload: ReturnType<typeof buildParams.list> = {
        page: 1,
        pageSize: 10,
        query: {},
        populates: [],
      }

      const columns: ColumnItem[] = [
        {
          label: 'Id',
          prop: 'id',
          columnProps: { minWidth: '100px' },
          render: (row) => {
            return (
              <div
                onClick={() => {
                  this.$copyText(row.id)
                  this.$showMessage({
                    message: 'Coppied',
                    type: 'success',
                  })
                }}
                class="truncate"
              >
                {row.id}
              </div>
            )
          },
        },
      ]

      Object.keys(this.entity.schema).forEach((key) => {
        // column
        const column: ColumnItem = { prop: key, label: key } as any
        const field = this.entity.schema[key] as SchemaField

        switch (field.type) {
          case 'Boolean':
            column.type = 'tag'
            break

          case 'ObjectId':
            payload.populates.push({
              path: key,
              ref: field.ref,
              justOne: !field.isArray,
            } as never)
            column.render = (row) => {
              const ref = this.$store.state.admin.entities.find(
                (item) => item.id === field.ref
              )
              const val = Array.isArray(row[key]) ? row[key] : [row[key]]
              return (
                <div class="flex flex-wrap gap-1">
                  {val.map((item) => {
                    const v = get(
                      item,
                      Object.keys(ref?.schema || {}).find((key) =>
                        ['name', 'title', 'id'].includes(key)
                      ) || 'name'
                    )

                    return v ? (
                      <el-tag>{v || item.id}</el-tag>
                    ) : (
                      <span
                        class="truncate"
                        onClick={() => {
                          this.$copyText(item.id)
                          this.$showMessage({
                            message: 'Coppied',
                            type: 'success',
                          })
                        }}
                      >
                        {item.id}
                      </span>
                    )
                  })}
                </div>
              )
            }
            break

          case 'Date':
            column.formatter = ['date', 'DD/MM/YYYY HH:mm']

            break

          case 'Mixed':
            column.render = (row) => {
              if (row && typeof row === 'object') {
                return (
                  <el-popover trigger="hover" open-delay={500}>
                    <div class="relative">
                      <VueJsonPretty
                        style="max-height: 400px; width:300px; overflow-y:auto;"
                        data={row[key]}
                      ></VueJsonPretty>

                      <el-button
                        onClick={() => this.copyObject(row[key])}
                        class="absolute right-0 top-0"
                        style="margin:0; padding:0;"
                        type="text"
                      >
                        Copy
                      </el-button>
                    </div>
                    <div slot="reference" class="truncate">
                      {JSON.stringify(row[key], null, 2)}
                    </div>
                  </el-popover>
                )
              }

              if (row && typeof row === 'string') {
                return row[key]?.length > 20 ? (
                  <el-tooltip content={row[key]}>
                    <span
                      onClick={() => {
                        this.$copyText(row[key])
                        this.$showMessage({
                          message: 'Coppied',
                          type: 'success',
                        })
                      }}
                      class="truncate"
                    >
                      {row[key]}
                    </span>
                  </el-tooltip>
                ) : (
                  row[key]
                )
              }

              return row
            }

            break

          default:
            column.render = (row) => {
              return row[key]?.length > 20 ? (
                <el-tooltip content={row[key]}>
                  <span
                    onClick={() => {
                      this.$copyText(row[key])
                      this.$showMessage({
                        message: 'Coppied',
                        type: 'success',
                      })
                    }}
                    class="truncate relative"
                  >
                    {row[key]}
                  </span>
                </el-tooltip>
              ) : (
                row[key]
              )
            }
            break
        }

        columns.push(column)
      })

      columns.push({
        prop: 'actions',
        label: 'Actions',
        columnProps: { fixed: 'right', width: '110px' },
        render: (row) => {
          return (
            <div class="flex flex-wrap gap-1">
              <el-button
                onClick={() => {
                  this.selectedRow = row
                  this.isShowRawJson = true
                }}
                icon="el-icon-view"
                size="mini"
                style="padding: 6px; margin: 0"
              ></el-button>
              <el-button
                onClick={() => {
                  this.handleShowUpdate(row)
                }}
                icon="el-icon-edit"
                type="primary"
                size="mini"
                style="padding: 6px; margin: 0"
              ></el-button>
              <el-button
                onClick={() => {
                  this.handleDelete(row)
                }}
                icon="el-icon-delete"
                type="danger"
                size="mini"
                style="padding: 6px; margin: 0"
              ></el-button>
            </div>
          )
        },
      })

      columns.forEach((columns) => {
        columns.columnProps = columns.columnProps || {}
        columns.columnProps.minWidth =
          columns.columnProps.minWidth ||
          columns.label.length * (59 / 6) + 20 + 'px'
      })

      this.table = {
        data: [],
        payload,
        endpoint: this.entity.endpoint,
        columns,
      } as DataTableProps
    },

    async handleDelete(row) {
      const isContinue = await this.$confirm('Xóa bản ghi?', 'Chú ý', {
        type: 'warning',
      })
      if (isContinue) {
        try {
          const deleted = await this.$axios.$delete(this.entity.endpoint, {
            params: buildParams.delete({
              query: {
                id: row.id,
              },
            }),
          })

          if (deleted > 0) {
            removeItems(this.table.data, (e) => e === row)
            this.$showMessage('Xóa thành công!')
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    handleShowUpdate(row) {
      this.dataUpdate = cloneDeep(row)
      this.isShowDialogUpdate = true
    },
    async handleUpdate() {
      const valid = await (this.$refs.formUpdate as any).validate()

      if (valid) {
        try {
          const data = await this.$axios.$put(
            this.entity.endpoint,
            buildParams.create({
              query: {
                id: this.dataUpdate.id,
              },
              data: this.dataUpdate,
              populates: this.table.payload.populates,
            })
          )

          if (data) {
            this.$showMessage({
              message: 'Cập nhật thành công',
              type: 'success',
            })
            replace(this.table.data, data, 'id')
          }
          this.isShowDialogUpdate = false
        } catch (error) {
          console.error()
        }
      }
    },
  },
})
</script>

<style lang="scss">
.crud-dialog-create-wrapper {
  display: flex;

  .crud-dialog-create {
    margin-top: auto !important;
    margin-bottom: auto !important;
    @apply w-full sm:max-w-screen-sm md:max-w-screen-sm;

    overflow: hidden;
    .el-dialog__body {
      max-height: calc(95vh - 55px - 60px);
      overflow-y: auto;
    }
  }
}
</style>
