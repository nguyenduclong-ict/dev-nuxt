<template>
  <div class="page">
    <div class="page-header flex">
      <div class="left flex-1"></div>
      <div class="right">
        <el-button icon="el-icon-plus" type="primary" @click="handleShowDialog">
          {{ $t('Thêm Người dùng') }}
        </el-button>
      </div>
    </div>

    <DataTable v-bind="table" class="mt-4" @row-click="handleRowClick" />

    <el-dialog
      width="500px"
      :visible.sync="isVisible"
      :title="$t('Thêm người dùng')"
      custom-class="reponsive"
    >
      <Form ref="form" :model="form" :items="formItems" />
      <div slot="footer" class="flex justify-center">
        <el-button type="primary" @click="handleCreateUser">
          {{ $t('create') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="500px"
      :visible.sync="isDetail"
      :title="
        $t(
          isEdit
            ? 'Cập nhật người dùng'
            : isChangePassword
            ? 'Đổi mật khẩu'
            : 'Thông tin người dùng'
        )
      "
      custom-class="reponsive"
    >
      <Form
        v-if="isEdit"
        ref="formEdit"
        :model="editData"
        :items="formEditItems"
      />

      <Form
        v-else-if="isChangePassword"
        ref="formChangePassword"
        :model="formChangePassword"
        :items="formChangePasswordItems"
      />

      <Form v-else ref="formView" :model="editData" :items="formViewItems" />

      <div slot="footer" class="flex justify-center">
        <el-button
          v-if="!isEdit && !isChangePassword"
          type="warning"
          @click="handleShowChangePassword"
        >
          {{ $t('Đổi mật khẩu') }}
        </el-button>

        <el-button
          v-if="!isEdit && !isChangePassword"
          type="primary"
          @click="handleShowEdit"
        >
          {{ $t('Cập nhật') }}
        </el-button>

        <el-button v-if="isEdit || isChangePassword" @click="handleCancel">
          {{ $t('Hủy') }}
        </el-button>

        <el-button
          v-if="isChangePassword"
          type="primary"
          @click="handleUpdatePassword"
        >
          {{ $t('Xác nhận') }}
        </el-button>

        <el-button v-if="isEdit" type="success" @click="handleUpdate">
          {{ $t('Lưu') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { toMongoId } from '@nguyenduclong/mongodbts'
import { cloneDeep } from '@/utils/lodash'
import { replace } from '@/utils/utils'
import Vue from 'vue'
import { equalToField } from '@/utils/client/validate'
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
      isChangePassword: false,
      formChangePassword: {
        passsword: '',
        username: '',
        confirmPassword: '',
      },

      rowClicked: null,
      editData: null,

      formViewItems: [
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
          props: {
            name: 'username',
            disabled: true,
          },
        },
        {
          type: 'input',
          label: 'Email',
          key: 'email',
          rules: {
            type: 'email',
          },
          props: {
            name: 'email',
            disabled: true,
          },
        },
        {
          key: 'roles',
          type: 'select-entity',
          label: this.$t('Vai trò'),
          props: {
            endpoint: '/api/entity/roles',
            multiple: true,
            disabled: true,
            style: {
              width: '100%',
            },
          },
        },
        {
          key: 'blocked',
          type: 'checkbox',
          props: {
            disabled: true,
            label: this.$t('Block tài khoản'),
          },
        },
        {
          key: 'isAdmin',
          type: 'checkbox',
          props: {
            label: this.$t('Is Admin'),
            disabled: true,
          },
        },
      ],

      formEditItems: [
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
          props: {
            disabled: true,
            name: 'username',
          },
        },
        {
          type: 'input',
          label: 'Email',
          key: 'email',
          rules: {
            type: 'email',
          },
          props: {
            name: 'email',
          },
        },
        {
          key: 'roles',
          type: 'select-entity',
          label: this.$t('Vai trò'),
          props: {
            endpoint: '/api/entity/roles',
            multiple: true,
            style: {
              width: '100%',
            },
          },
        },
        {
          key: 'blocked',
          type: 'checkbox',
          props: {
            label: this.$t('Block tài khoản'),
          },
        },
        {
          key: 'isAdmin',
          type: 'checkbox',
          props: {
            label: this.$t('Is Admin'),
          },
        },
      ],

      formChangePasswordItems: [
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
          props: {
            disabled: true,
            name: 'username',
          },
        },
        {
          type: 'input',
          label: 'Password',
          key: 'password',
          rules: {
            required: true,
            trigger: 'change',
            min: 4,
          },
          props: {
            showPassword: true,
          },
        },
        {
          type: 'input',
          label: 'Confirm Password',
          key: 'confirmPassword',
          rules: [
            {
              required: true,
              trigger: 'change',
              min: 4,
            },
            equalToField(
              this,
              'formChangePassword.password',
              this.$t('Mật khẩu không khớp')
            ),
          ],
          props: {
            name: 'confirm_password',
            showPassword: true,
          },
        },
      ],

      form: {
        username: '',
        password: '',
        isAdmin: false,
        roles: [],
      },

      formItems: [
        {
          type: 'input',
          label: 'Username',
          key: 'username',
          rules: { required: true, min: 4 },
          props: {
            name: 'username',
          },
        },
        {
          type: 'input',
          label: 'Email',
          key: 'email',
          rules: {
            type: 'email',
          },
          props: {
            name: 'email',
          },
        },
        {
          type: 'input',
          label: 'Password',
          key: 'password',
          rules: {
            required: true,
            trigger: 'change',
            min: 4,
          },
          props: {
            showPassword: true,
          },
        },
        {
          type: 'input',
          label: 'Confirm Password',
          key: 'confirmPassword',
          rules: [
            {
              required: true,
              trigger: 'change',
              min: 4,
            },
            equalToField(this, 'form.password', this.$t('Mật khẩu không khớp')),
          ],
          props: {
            name: 'confirm_password',
            showPassword: true,
          },
        },
        {
          key: 'roles',
          type: 'select-entity',
          label: this.$t('Vai trò'),
          props: {
            endpoint: '/api/entity/roles',
            multiple: true,
            style: {
              width: '100%',
            },
          },
        },
        {
          key: 'blocked',
          type: 'checkbox',
          props: {
            label: this.$t('Block tài khoản'),
          },
        },
        {
          key: 'isAdmin',
          type: 'checkbox',
          props: {
            label: this.$t('Is Admin'),
          },
        },
      ],

      table: {
        endpoint: '/api/entity/users',
        data: [],
        payload: {
          populates: [{ path: 'roles', ref: 'Role', justOne: false }],
        },
        columns: [
          { prop: 'username', label: this.$t('Username') },
          { prop: 'isAdmin', label: this.$t('Is Admin'), type: 'tag' },
          { prop: 'blocked', label: this.$t('Đã khóa'), type: 'tag' },
          {
            prop: 'roles',
            label: this.$t('Vai trò'),
            type: 'tag',
            isArray: true,
            render: (row) => (
              <div class="flex flex-wrap gap-1">
                {row.roles.map((e) => (
                  <el-tag>{e.name}</el-tag>
                ))}
              </div>
            ),
          },
          {
            prop: 'email',
            label: this.$t('Email'),
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
                visible: (row) => !row.isAdmin,
                onClick: ({ row }) => {
                  this.$router.push({
                    name: ROUTES.ADMIN_USERS_PERMISSION,
                    params: { id: row.id },
                  })
                },
              },
              {
                action: 'delete',
                visible: (row) => row.id !== this.$auth.user.id,
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
      this.isChangePassword = false
    },

    handleShowChangePassword() {
      this.formChangePassword = {
        username: this.rowClicked.username,
        passsword: '',
        confirmPassword: '',
      }
      this.isChangePassword = true
    },

    handleShowEdit() {
      this.isEdit = true
    },

    async handleUpdate() {
      try {
        const data = await this.$axios.$put(
          '/api/auth/update-user',
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

    async handleUpdatePassword() {
      const isnext = await this.$confirm('Xác nhận đổi mật khẩu', 'Xác nhận', {
        message: this.$t('Xác nhận đổi mật khẩu?') as any,
        type: 'warning',
      })
      if (!isnext) return
      try {
        const data = await this.$axios.$put(
          '/api/auth/update-password',
          this.formChangePassword
        )
        console.log(data)
        this.$showMessage('Thành công', 'success')
      } catch (error) {
        console.log(error)
        this.$showError(error)
      }
    },

    handleRowClick(row) {
      this.editData = cloneDeep({
        ...row,
        roles: row.roles.map((item) => toMongoId(item)),
      })
      this.rowClicked = row
      this.isDetail = true
      this.isEdit = false
      this.isChangePassword = false
    },

    handleShowDialog() {
      this.form = {
        username: '',
        password: '',
        roles: [],
        isAdmin: false,
      }

      this.isVisible = true
      ;(this.$refs.form as any)?.clearValidate()
    },

    async handleCreateUser() {
      const valid = await this.$validateForm(this.$refs.form)
      if (valid) {
        try {
          const user = await this.$axios.$post(
            '/api/auth/create-user',
            this.form
          )

          this.table.data.push(user)
          this.$message.success('Thêm tài khoản thành công')
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
