import { PermissionType } from '@/server/constants'
import { User } from '@/server/entities'
import { PermissionHelper } from '@/server/helpers/permission'
import { Middleware } from '@nuxt/types'

const PermissionMiddleware: Middleware = (context) => {
  const { route, $auth, error, i18n } = context
  const checker = new PermissionHelper($auth.user as unknown as User)

  for (const matched of route.matched) {
    if (matched.meta.permission === false) {
      continue
    }
    let permisison
    if (matched.meta?.getPermission) {
      // eslint-disable-next-line no-eval
      const func = eval(matched.meta?.getPermission)
      permisison = func.call(null, context)
    } else {
      permisison = matched.meta.permission || {
        type: PermissionType.PAGE,
        page: matched.name,
      }
    }

    if (typeof permisison === 'function')
      // eslint-disable-next-line no-useless-call
      permisison = permisison.call(null, context)

    if (!checker.hasPermission(permisison)) {
      return error({
        statusCode: 403,
        message: i18n.t('Bạn không có quyền truy cập trang này') as any,
      })
    }
  }
}

export default PermissionMiddleware
