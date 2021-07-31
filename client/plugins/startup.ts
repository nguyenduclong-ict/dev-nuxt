import { Plugin } from '@nuxt/types'
import { get } from '@/utils/lodash'
import { loadLocale } from '@/utils/locale'
import { Message } from 'element-ui'
import { getErrorMessage } from '@/utils/utils'
import locale from '~/config/locale.json'
import { ROUTES } from '~/config/router/const'
import { registerGlobalMixin } from '~/mixins/global.mixin'

registerGlobalMixin()

const startupPlugin: Plugin = async ({
  $axios,
  store,
  i18n,
  redirect,
  route,
  app,
}) => {
  const project = await $axios.$get('/api/config/project')

  $axios.onError((error) => {
    if (!error.config.headers.skipErrorMessage && process.client) {
      ;(error as any).displayed = true
      Message.error({
        message: i18n.t(getErrorMessage(error)) as string,
        center: true,
        customClass: 'custom-el-message',
      })
    }
  })

  if (!project) {
    if (route.name === ROUTES.ADMIN_LOGIN) {
      setTimeout(() => {
        redirect({ name: ROUTES.ADMIN_INIT })
      }, 100)
    } else {
      redirect({ name: ROUTES.ADMIN_INIT })
    }
    return
  }

  store.commit('admin/setProject', project)

  //  I18n
  const messages = loadLocale(locale)

  Object.keys(messages).forEach((key) => {
    i18n.setLocaleMessage(key, get(messages, key))
  })
  i18n.silentTranslationWarn = true
  i18n.silentFallbackWarn = true

  // init history
  if (process.client) {
    app.router?.afterEach((to) => {
      store.commit('addHistory', to)
    })

    window.onpopstate = () => {
      store.commit('popHistory', 2)
    }
  }
}

export default startupPlugin
