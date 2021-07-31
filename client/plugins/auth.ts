import { Plugin } from '@nuxt/types'

const AuthPlugin: Plugin = async ({ $axios, app, $auth }) => {
  if ($auth.loggedIn) {
    if ($auth.user?.isAdmin) {
      $axios.$post('/api/config/pages', {
        pages: app.router
          ?.getRoutes()
          .map((route) => ({ name: route.name, path: route.path })),
      })
    }

    const entities = await $axios.$get('/api/entity')
    app.store?.commit('admin/setEntities', entities)
  }
}

export default AuthPlugin
