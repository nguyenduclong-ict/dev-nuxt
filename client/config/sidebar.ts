import { DefaultPermission, PermissionType } from '@/server/constants'
import { Permission } from '@/server/entities'

export interface SidebarItem {
  name?: string
  type?: 'group' | (string & {})
  id?: string
  icon?: string
  path?: string
  permission?: Partial<Permission>
  children?: SidebarItem[]
}

export const adminSidebars: SidebarItem[] = [
  {
    icon: 'el-icon-s-home',
    name: 'Dashboard',
    permission: {
      type: PermissionType.PAGE,
      page: 'AdminDashboard',
    },
    path: '/admin',
  },
  {
    type: 'group',
    name: 'Phân quyền',
    permission: {
      type: PermissionType.OTHER,
      name: DefaultPermission.Authorize,
    },
    children: [
      {
        icon: 'el-icon-user',
        name: 'Người dùng',
        path: '/admin/users',
      },
      {
        icon: 'icofont-users',
        name: 'Vai trò',
        path: '/admin/roles',
      },
    ],
  },
  {
    type: 'group',
    id: 'entities',
    name: 'Đối tượng',
    children: [],
  },
]
