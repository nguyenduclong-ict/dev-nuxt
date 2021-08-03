import { PermissionAction, PermissionType } from '@/server/constants'
import { PermissionHelper } from '@/server/helpers/permission'
import { cloneDeep } from '@/utils/lodash'
import { set } from '@/utils/client/vuex'
import { Getter } from 'vuex/types/index'
import { adminSidebars, ROUTES, SidebarItem } from '~/config'

export const state = () => ({
  project: null as any,
  pages: [] as any[],
  entities: [],
  sidebar: {
    collapse: false,
  },
})

export const mutations = {
  setPages: set('pages'),
  setEntities: set('entities'),
  setProject: set('project'),
  toggleSidebar(state: any, value: boolean) {
    state.sidebar.collapse = value ?? !state.sidebar.collapse
  },
}

export const getters: { [x: string]: Getter<any, any> } = {
  sidebarItems(state: any, getterts: any, rootState: any, rootGetters) {
    let result: SidebarItem[] = []
    const user = rootState.auth.user
    const checker = new PermissionHelper(user)

    const entities = cloneDeep(state.entities)

    const filterMenu = (item: SidebarItem) => {
      if (item.permission && !checker.hasPermission(item.permission)) {
        return false
      }

      if (item.children) item.children = item.children.filter(filterMenu)

      if (item.type === 'group' && !item.children?.length) {
        return false
      }

      return true
    }

    const items = cloneDeep(adminSidebars)
    const entitiesMenu = items.find((item) => item.id === 'entities')

    if (entitiesMenu) {
      entitiesMenu.children = entities.map(
        (e) =>
          ({
            name: e.name,
            path: '/admin/entity/' + e.id,
            route: { name: ROUTES.ADMIN_ENTITY_DETAIL, params: { id: e.id } },
            permission: {
              type: PermissionType.ENTITY,
              entity: {
                name: e.name,
                action: PermissionAction.READ,
              },
            },
          } as SidebarItem)
      )
    }

    result.push(...items)

    result = result.filter(filterMenu)

    return result
  },
}
