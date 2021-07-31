import { DefaultPermission, PermissionType } from '@/server/constants'
import { ROUTES } from './const'
import { loadPage, RouteItem } from './helper'

export const routes: RouteItem[] = [
  {
    name: ROUTES.ADMIN,
    path: '/admin',
    component: loadPage('admin/index.vue'),
    meta: {
      isAdmin: true,
      permission: {
        type: PermissionType.OTHER,
        name: DefaultPermission.AdminPannel,
      },
    },
    children: [
      {
        name: ROUTES.ADMIN_DASHBOARD,
        path: '',
        component: loadPage('admin/dashboard.vue'),
        meta: { isAdmin: true },
      },
      {
        name: ROUTES.ADMIN_USERS,
        path: 'users',
        component: loadPage('admin/users.vue'),
        meta: { isAdmin: true },
      },
      {
        name: ROUTES.ADMIN_ROLES,
        path: 'roles',
        component: loadPage('admin/roles.vue'),
        meta: { isAdmin: true },
      },
      {
        name: ROUTES.ADMIN_USERS_PERMISSION,
        path: 'user/:id/permission',
        component: loadPage('admin/user_permission.vue'),
        meta: { title: 'Quyền người dùng', sidebarKey: '/admin/users' },
      },
      {
        name: ROUTES.ADMIN_ROLES_PERMISSION,
        path: 'role/:id/permission',
        component: loadPage('admin/role_permission.vue'),
        meta: { title: 'Quyền vai trò', sidebarKey: '/admin/roles' },
      },
      {
        name: ROUTES.ADMIN_ENTITY,
        path: 'entity',
        meta: { permission: false },
        component: loadPage('admin/entity/index.vue'),
        children: [
          {
            name: ROUTES.ADMIN_ENTITY_DETAIL,
            path: ':id',
            component: loadPage('admin/entity/detail.vue'),
            meta: {
              getTitle: `({route, entities}) => {
                const entity = entities.find(
                  (e) => e.id === route.params.id
                )
                if (entity) return entity.name
                return route.params.id
              }`,
              getPermission: `({ route }) => {
                return {
                  type: "entity",
                  entity: {
                    name: route.params.id,
                    action: "read",
                  },
                }
              }`,
            },
          },
        ],
      },
    ],
  },
  {
    name: ROUTES.ADMIN_INIT,
    path: '/admin/init',
    component: loadPage('admin/init.vue'),
    meta: { isAdmin: true, permission: false, title: 'Khởi tạo dự án' },
  },
  {
    name: ROUTES.ADMIN_LOGIN,
    path: '/admin/login',
    component: loadPage('admin/login.vue'),
    meta: { isAdmin: true, permission: false },
  },
  {
    name: ROUTES.REDIRECT,
    path: '/redirect/:state',
    component: loadPage('/redirect.vue'),
    meta: { permission: false },
  },
]
