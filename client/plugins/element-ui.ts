import Vue from 'vue'
import Element from 'element-ui'
import Cookies from 'js-cookie'
// @ts-ignore
import locale from 'element-ui/lib/locale/lang/vi'

import * as Custom from '~/components/Admin/ExtendElementUI'

Vue.use(Element, { size: Cookies.get('elsize') || 'medium', locale })

Object.keys(Custom).forEach((key) => {
  Vue.component('El' + key, (Custom as any)[key])
})
