import { flatMap } from '@/utils/lodash'
import { Mutation } from 'vuex/types/index'
import { set } from '@/utils/client/vuex'

export const state = () => ({
  routes: [],
  histories: [],
  responsive: '',
})

export const mutations: { [x: string]: Mutation<ReturnType<typeof state>> } = {
  setRoutes: set('routes'),
  addHistory(state, value) {
    state.histories.push(value)
  },
  popHistory(state, step = 1) {
    state.histories.splice(state.histories.length - step)
  },
  setResponsive: set('responsive'),
}

export const getters = {
  userPermissions(state) {
    const user = state.auth.user
    const userPermissions = [
      ...user.permissions,
      ...flatMap(user.roles, (role) => role.permissions),
    ]
    return userPermissions
  },
  canBack() {
    return !!(window?.history.length > 2)
  },
}
