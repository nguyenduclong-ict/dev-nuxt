import { join } from 'path'
import { Context } from '@nuxt/types'
import { Permission } from '@/server/entities'

export const loadPage = (path: string) => {
  return process.cwd() + '/client/pages/' + path
}

export interface RouteItem {
  redirect?: string | { name?: string; path?: string }
  name: string
  path: string
  component?: any
  children?: RouteItem[]
  meta?: {
    isAdmin?: boolean
    title?: string
    sidebarKey?: string
    permission?:
      | false
      | string
      | Partial<Permission>
      | ((context: Context) => any)
    getTitle?: string // excute with eval()
    getPermission?: string // excute with eval()
    menu?: {
      name?: string
      icon?: string
    }
  }
}
