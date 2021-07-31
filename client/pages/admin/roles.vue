<template>
  <div class="page">
    <div class="page-header flex">
      <div class="left flex-1"></div>
      <div class="right">
        <el-button icon="el-icon-plus" type="primary" @click="handleShowDialog">
          {{ $t('Thêm Vai trò') }}
        </el-button>
      </div>
    </div>

    <DataTable v-bind="table" class="mt-4" @row-click="handleRowClick" />

    <el-dialog
      width="500px"
      :visible.sync="isVisible"
      :title="$t('Thêm Vai trò')"
      custom-class="reponsive"
    >
      <Form ref="form" :model="form" :items="formItems" />
      <div slot="footer" class="flex justify-center">
        <el-button type="primary" @click="handleCreateRole">
          {{ $t('create') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="500px"
      :visible.sync="isDetail"
      :title="$t(isEdit ? 'Cập nhật Vai trò' : 'Thông tin Vai trò')"
      custom-class="reponsive"
    >
      <Form
        v-if="isEdit"
        ref="formEdit"
        :model="editData"
        :items="formEditItems"
      />

      <Form v-else ref="formView" :model="editData" :items="formViewItems" />

      <div slot="footer" class="flex justify-center">
        <el-button v-if="!isEdit" type="primary" @click="handleShowEdit">
          {{ $t('Cập nhật') }}
        </el-button>

        <el-button v-if="isEdit" @click="handleCancel">
          {{ $t('Hủy') }}
        </el-button>

        <el-button v-if="isEdit" type="success" @click="handleUpdate">
          {{ $t('Lưu') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { cloneDeep } from '@/utils/lodash'
import { replace } from '@/utils/utils'
import Vue from 'vue'
import DataTable from '~/components/Admin/Common/DataTable.vue'
import Form from '~/components/Admin/Common/Form.vue'
import { ROUTES } from '~/config'

export default Vue.extend({
  components: { DataTable, Form },

  data() {
    return {
      isVisible: false,
      isEdit: false,
      isDetail: false,
      rowClicked: null,
      editData: null,
      formViewItems: [
        {
          type: 'input',
          label: 'Tên',
          key: 'name',
          rules: { required: true, min: 3 },
          props: {
            name: 'name',
            disabled: true,
          },
          placeholder: 'Nhập tên cho vai trò',
        },
      ] as FormItems,

      formEditItems: [
        {
          type: 'input',
          label: 'Tên',
          key: 'name',
          rules: { required: true, min: 3 },
          props: {
            name: 'name',
          },
          placeholder: 'Nhập tên cho vai trò',
        },
      ] as FormItems,

      form: {
        name: '',
        isDefault: false,
      },

      formItems: [
        {
          type: 'input',
          label: 'Tên',
          key: 'name',
          placeholder: 'Nhập tên vai trò',
          rules: { required: true, min: 3 },
          props: {
            name: 'name',
          },
        },
      ] as FormItems,

      table: {
        endpoint: '/api/entity/roles',
        data: [],
        payload: {
          populates: ['permissions'],
        },
        columns: [
          { prop: 'name', label: this.$t('Tên') },
          {
            prop: 'isDefault',
            label: this.$t('Mặc định'),
            type: 'tag',
          },
          {
            prop: 'permissions',
            render: (row) => (
              <el-link>{row.permissions.length + ' quyền'}</el-link>
            ),
          },
          {
            prop: 'createdAt',
            label: this.$t('Created At'),
            formatter: 'date',
          },
          {
            prop: 'updatedAt',
            label: this.$t('Updated At'),
            formatter: 'date',
          },
          {
            label: this.$t('Actions'),
            type: 'action',
            actions: [
              {
                action: 'authorize',
                text: this.$t('Phân quyền'),
                type: 'warning',
                onClick: ({ row }) => {
                  this.$router.push({
                    name: ROUTES.ADMIN_ROLES_PERMISSION,
                    params: { id: row.id },
                  })
                },
              },
              {
                action: 'delete',
                visible: (row) => !row.isDefault,
              },
            ],
          },
        ],
      } as DataTableProps,
    }
  },

  methods: {
    handleCancel() {
      this.isEdit = false
    },

    handleShowEdit() {
      this.isEdit = true
    },

    async handleUpdate() {
      try {
        const data = await this.$axios.$put(
          '/api/auth/update-role',
          this.editData
        )
        console.log(data)
        this.$showMessage('Thành công', 'success')
        replace(this.table.data, data, 'id')
        this.isEdit = false
      } catch (error) {
        console.log(error)
        this.$showError(error)
      }
    },

    handleRowClick(row) {
      if (row.isDefault) {
        return
      }
      this.editData = cloneDeep(row)
      this.rowClicked = row
      this.isDetail = true
      this.isEdit = false
    },

    handleShowDialog() {
      this.form = {
        isDefault: false,
        name: '',
      }

      this.isVisible = true
      ;(this.$refs.form as any)?.clearValidate()
    },

    async handleCreateRole() {
      const valid = await this.$validateForm(this.$refs.form)
      if (valid) {
        try {
          const user = await this.$axios.$post(
            '/api/auth/create-role',
            this.form
          )

          this.table.data.push(user)
          this.$message.success('Thêm vai trò thành công')
          this.isVisible = false
        } catch (error) {
          console.error(error)
          this.$showError(error)
        }
      }
    },
  },
})
</script>

<style scoped></style>
