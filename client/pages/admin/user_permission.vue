<template>
  <div class="page">
    <div class="page-header">
      <BackButton />
      <div class="flex-1"></div>
      <el-button type="success" @click="handleUpdate">Lưu</el-button>
    </div>

    <div class="text-3xl">
      {{ _.get(user, 'profile.name') || user.username }}
    </div>

    <el-row class="page-content" :gutter="24">
      <el-col :md="16">
        <el-tabs type="border-card">
          <el-tab-pane label="Entity">
            <span slot="label">{{ $t('Đối tượng') }}</span>
            <el-alert
              :title="$t('Quyền thao tác với các đối tượng')"
              type="info"
              :closable="false"
            ></el-alert>

            <el-table
              ref="entityTable"
              :data="entities"
              style="width: 100%"
              stripe
              row-key="id"
              @selection-change="handleEntitySelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column :label="$t('Tên')" prop="name"></el-table-column>

              <el-table-column
                v-for="action in actions"
                :key="action"
                :label="$t(getActionName(action))"
                width="120"
              >
                <template slot-scope="{ row }">
                  <el-checkbox
                    :value="!!row.permission[action]"
                    @change="handleToggleEntity(row, action, $event)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column :label="$t('Cài đặt')" :width="120">
                <template slot-scope="{ row }">
                  <el-button
                    :disabled="!isShowSettingButton(row)"
                    size="mini"
                    icon="el-icon-setting"
                    @click="handleShowEntitySetting(row)"
                  >
                    {{ $t('Cài đặt') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="Api">
            <span slot="label">{{ $t('Api Endpoint') }}</span>
            <el-alert
              :title="$t('Quyền truy cập Url')"
              type="info"
              :closable="false"
            ></el-alert>

            <el-table
              ref="apiTable"
              :data="apis"
              style="width: auto"
              stripe
              row-key="fullPath"
              row-class-name="cursor-pointer"
              @row-click="handleToggleApi"
              @selection-change="handleApiSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column
                :label="$t('Method')"
                prop="method"
                width="100px"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    size="small"
                    effect="dark"
                    :type="
                      _.get(
                        {
                          get: 'primary',
                          post: 'warning',
                          update: 'success',
                          delete: 'danger',
                        },
                        row.method
                      )
                    "
                  >
                    {{ row.method.toUpperCase() }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('Path')"
                prop="fullPath"
              ></el-table-column>
            </el-table>

            <el-alert
              :title="$t('Đường dẫn công khai')"
              :description="
                $t(
                  'Các đường dẫn này không cần quyền hoặc yêu cầu các quyền khác như Đối tượng, Trang vv...'
                )
              "
              type="info"
              :closable="false"
            ></el-alert>

            <el-table
              :data="publicApis"
              style="width: auto"
              row-key="fullPath"
              row-class-name="cursor-pointer"
            >
              <el-table-column
                :label="$t('Method')"
                prop="method"
                width="100px"
              >
                <template slot-scope="{ row }">
                  <el-tag
                    size="small"
                    effect="dark"
                    :type="
                      _.get(
                        {
                          get: 'primary',
                          post: 'warning',
                          update: 'success',
                          delete: 'danger',
                        },
                        row.method
                      )
                    "
                  >
                    {{ row.method.toUpperCase() }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('Path')"
                prop="fullPath"
              ></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="Page">
            <span slot="label">{{ $t('Trang') }}</span>
            <el-alert
              :title="$t('Quyền truy cập các trang giao diện')"
              type="info"
              :closable="false"
            ></el-alert>

            <el-table
              ref="pageTable"
              :data="pages"
              style="width: auto"
              stripe
              row-key="name"
              row-class-name="cursor-pointer"
              @row-click="handleTogglePage"
              @selection-change="handlePageSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>

              <el-table-column
                :label="$t('Đường dẫn')"
                prop="path"
              ></el-table-column>

              <el-table-column :label="$t('Tên')">
                <template slot-scope="{ row }">
                  {{ _.get(row, 'meta.title') || row.name }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :md="8" class="mt-4 md:mt-0">
        <el-tabs type="border-card">
          <el-tab-pane label="Permission">
            <span slot="label">{{ $t('Quyền đặc biệt') }}</span>
            <el-alert
              :title="$t('Các quyền khác')"
              type="info"
              :closable="false"
            ></el-alert>

            <el-table
              ref="specialTable"
              :data="specialPermissions"
              style="width: 100%"
              stripe
              row-key="name"
              row-class-name="cursor-pointer"
              @row-click="handleToggleSpecial"
              @selection-change="handleSpecialSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column :label="$t('Tên')" prop="name"></el-table-column>
              <el-table-column
                :label="$t('Mô tả')"
                prop="description"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      :title="$t('Tùy chỉnh quyền')"
      :visible.sync="isShowEntityPermissionSetting"
      width="600px"
    >
      <div class="mb-2">
        <el-alert :closable="false">
          <ul slot="title">
            <li>
              <span class="font-bold">{{ $t('Nếu là người tạo') }}:</span>
              <span>
                {{
                  $t('Quyền chỉ được áp dụng khi user là người tạo document')
                }}
              </span>
            </li>

            <li>
              <span class="font-bold">
                {{ $t('Có vai trò của người tạo') }}:
              </span>
              <span>
                {{ $t('Quyền áp dụng khi user cùng vai trò với người tạo') }}
              </span>
            </li>
          </ul>
        </el-alert>
      </div>

      <el-form v-if="settingRow" label-position="left" label-width="150px">
        <!-- eslint-disable -->
        <el-form-item
          v-for="(item, action) in settingRow.permission"
          v-if="item"
          :key="action"
          :label="$t(getActionName(action))"
        >
          <el-select
            class="w-full"
            :value="
              [
                item.isCreator ? 'isCreator' : null,
                item.isSameRole ? 'isSameRole' : null,
              ].filter((e) => !!e)
            "
            multiple
            clearable
            @change="changeEntityOptions($event, item)"
          >
            <el-option value="isCreator" :label="$t('Nếu là người tạo')">
              {{ $t('Nếu là người tạo') }}
            </el-option>

            <el-option
              value="isSameRole"
              :label="$t('Có vai trò của người tạo')"
            >
              {{ $t('Có vai trò của người tạo') }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { PermissionType } from '@/server/constants'
import { EntityPermission, Permission, User } from '@/server/entities'
import { PermissionHelper } from '@/server/helpers/permission'
import { EntityDeclaration } from '@/server/helpers/repository'
import { RegistedApi } from '@/server/helpers/router'
import { cloneDeep } from '@/utils/lodash'
import Vue from 'vue'
import BackButton from '~/components/Admin/Common/BackButton.vue'
import { ROUTES } from '~/config'
import { buildParams } from '~/utils/client'

interface Data {
  permissions: Permission[] // all permissions
  entities: EntityDeclaration[]
  apis: (RegistedApi & { permission: EntityPermission })[]
  publicApis: (RegistedApi & { permission: EntityPermission })[]
  checker: PermissionHelper
  user: User
  isShowEntityPermissionSetting: boolean
  settingRow: EntityDeclaration
  permisOnSetting: EntityPermission[]
  actions: string[]
  pages: any[]
  menus: any[]
  specialPermissions: (Permission & { permission: EntityPermission })[]
  getActionName: (action: any) => string
}

export default Vue.extend({
  components: { BackButton },

  async asyncData({ $axios, params, redirect, app }): Promise<Data> {
    const [entities, _apis, user, permissions] = await Promise.all([
      $axios.$get('/api/entity'),
      $axios.$get('/api/config/apis'),
      $axios.$get('/api/entity/users/find-one', {
        params: buildParams.list({
          query: {
            id: params.id,
          },
          populates: [
            {
              path: 'permissions',
              populate: 'permission' as any,
            },
          ],
        }),
      }) as Promise<User>,
      $axios.$get('/api/entity/permissions/find') as Promise<Permission[]>,
    ])

    const apis = _apis.filter((e) => e.secured)
    const publicApis = _apis.filter((e) => !e.secured)

    if (user.isAdmin) {
      redirect({ name: ROUTES.ADMIN_USERS })
    }

    const checker = new PermissionHelper(user)

    entities.forEach((e) => {
      e.permission = { read: null, create: null, update: null, delete: null }
    })

    user.permissions.forEach((item) => {
      if (item.permission.type === PermissionType.ENTITY) {
        const entity = entities.find(
          (e) => e.id === item.permission.entity.name
        )
        if (entity) {
          entity.permission[item.permission.entity.action] = item
        }
      }
    })

    apis.forEach((api) => {
      api.permission = user.permissions.find(
        (item) =>
          item.permission?.type === 'api' &&
          item.permission?.api.method === api.method &&
          item.permission.api.endpoint === api.fullPath
      )
    })

    const pages = app.router.getRoutes().map((route) => {
      return cloneDeep({
        path: route.path,
        meta: route.meta,
        name: route.name,
        permission:
          user.permissions.find((item) => {
            return (
              item.permission.isDefault === true &&
              item.permission?.type === PermissionType.PAGE &&
              item.permission?.page === route.name
            )
          }) || null,
      })
    })

    const specialPermissions = permissions
      .filter((item) => {
        return item.type === PermissionType.OTHER
      })
      .map((item) =>
        cloneDeep({
          ...item,
          permission:
            user.permissions.find(
              (e) =>
                e.permission.type === PermissionType.OTHER &&
                e.permission.name === item.name
            ) || null,
        })
      )

    return {
      entities,
      apis,
      user,
      checker,
      permissions,
      isShowEntityPermissionSetting: false,
      settingRow: null,
      permisOnSetting: [],
      publicApis,
      pages,
      menus: [],
      actions: ['read', 'create', 'update', 'delete'],
      specialPermissions,
      getActionName: (action) =>
        ({ read: 'Xem', create: 'Tạo', update: 'Cập nhật', delete: 'Xóa' }[
          action
        ]),
    }
  },

  data(): Data {
    return {
      checker: null,
    } as Data
  },

  created() {},

  mounted() {
    ;(this.$refs.pageTable as any).selection.push(
      ...this.pages.filter((e) => !!e.permission)
    )
    ;(this.$refs.apiTable as any).selection.push(
      ...this.apis.filter((e) => !!e.permission)
    )
    ;(this.$refs.specialTable as any).selection.push(
      ...this.specialPermissions.filter((e) => !!e.permission)
    )
    ;(this.$refs.entityTable as any).selection.push(
      ...this.entities.filter(
        (e) =>
          e.permission.read &&
          e.permission.create &&
          e.permission.update &&
          e.permission.delete
      )
    )
  },

  methods: {
    isChecked(entity: EntityDeclaration, action: string) {
      return !!this.checker.hasPermission({
        isDefault: false,
        type: 'entity',
        entity: {
          name: entity.name,
          action,
        },
      } as Permission)
    },

    handleToggleApi(row) {
      if (row.permission) {
        row.permission = null
      } else {
        row.permission = {
          entityName: 'User',
          permission: this.permissions.find((permission) => {
            return (
              permission.type === 'api' &&
              permission?.api.endpoint === row.fullPath &&
              permission?.api.method === row.method
            )
          }),
        } as EntityPermission
      }
      ;(this.$refs.apiTable as any).toggleRowSelection(row, !!row.permission)
    },

    handleApiSelectionChange(rows: any[]) {
      console.log('handleApiSelectionChange', rows)
      this.apis.forEach((api) => {
        if (!rows.includes(api)) {
          ;(api as any).permission = null
        } else {
          ;(api as any).permission = {
            entityName: 'User',
            permission: this.permissions.find((permission) => {
              return (
                permission.type === 'api' &&
                permission?.api.endpoint === api.fullPath &&
                permission?.api.method === api.method
              )
            }),
          } as EntityPermission
        }
      })
    },

    handleTogglePage(row) {
      if (row.permission) {
        row.permission = null
      } else {
        row.permission = {
          entityName: 'User',
          permission: this.permissions.find(
            (permission) =>
              permission.type === 'page' && permission.page === row.name
          ),
        } as EntityPermission
      }
      ;(this.$refs.pageTable as any).toggleRowSelection(row, !!row.permission)
    },

    handlePageSelectionChange(rows: any[]) {
      this.pages.forEach((page) => {
        if (!rows.includes(page)) {
          page.permission = null
        } else {
          page.permission = {
            entityName: 'User',
            permission: this.permissions.find(
              (permission) =>
                permission.type === 'page' && permission.page === page.name
            ),
          } as EntityPermission
        }
      })
    },

    handleToggleSpecial(row) {
      if (row.permission) {
        row.permission = null
      } else {
        row.permission = {
          entityName: 'User',
          permission: this.permissions.find(
            (permission) =>
              permission.type === PermissionType.OTHER &&
              permission.name === row.name
          ),
        } as EntityPermission
      }
      ;(this.$refs.specialTable as any).toggleRowSelection(
        row,
        !!row.permission
      )
    },

    handleSpecialSelectionChange(rows: any[]) {
      this.specialPermissions.forEach((item) => {
        if (!rows.includes(item)) {
          item.permission = null
        } else {
          item.permission = {
            entityName: 'User',
            permission: this.permissions.find(
              (permission) =>
                permission.type === PermissionType.OTHER &&
                permission.name === item.name
            ),
          } as EntityPermission
        }
      })
    },

    handleToggleEntity(
      entity: EntityDeclaration & AnyObject,
      action: string,
      value: boolean
    ) {
      if (value) {
        this.addAction(entity, action)
      } else {
        entity.permission[action] = null
      }
    },

    handleShowEntitySetting(row) {
      this.isShowEntityPermissionSetting = true
      this.settingRow = row
    },

    changeEntityOptions(items: string[], permisItem: EntityPermission) {
      if (permisItem) {
        permisItem.isCreator = items.includes('isCreator')
        permisItem.isSameRole = items.includes('isSameRole')
      }
    },

    isShowSettingButton(row) {
      return !Object.values(row.permission).every((e) => !e)
    },

    handleEntitySelectionChange(entities: EntityDeclaration[]) {
      this.entities.forEach((entity) => {
        if (entities.includes(entity)) {
          this.addAction(entity, 'read')
          this.addAction(entity, 'create')
          this.addAction(entity, 'update')
          this.addAction(entity, 'delete')
        } else {
          ;(entity as any).permission = {
            read: null,
            create: null,
            update: null,
            delete: null,
          }
        }
      })
    },

    addAction(entity: EntityDeclaration, action: any) {
      entity.permission[action] = {
        entityName: 'User',
        permission: this.permissions.find(
          (p) =>
            p.type === 'entity' &&
            p.entity.name === entity.id &&
            p.entity.action === action
        ),
        isCreator: true,
        isSameRole: true,
      }
    },

    async handleUpdate() {
      const permissions = []

      this.entities.forEach((entity) => {
        permissions.push(
          ...Object.values((entity as any).permission).filter((e) => !!e)
        )
      })

      this.pages.forEach((page) => {
        if (page.permission) permissions.push(page.permission)
      })

      this.apis.forEach((item) => {
        if (item.permission) permissions.push(item.permission)
      })

      this.specialPermissions.forEach((item) => {
        if (item.permission) permissions.push(item.permission)
      })

      const user = await this.$axios.$put('/api/auth/update-user-permissions', {
        user: this.user.id,
        permissions,
      })

      console.log(user)

      this.$showMessage({
        type: 'success',
        message: 'Cập nhật thành công',
      })

      // this.$router.back()
    },
  },
})
</script>
