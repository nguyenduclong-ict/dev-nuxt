import { MiddlewareId } from '@/server/middlewares/auth'
import { joinUrl } from '@/utils/utils'
import { Router, RequestHandler, Express } from 'express'
import globby from 'globby'

interface RouterModule {
  path: string
  router: Router
}

export function registerRoutes(dir: string, app: Express) {
  const paths = globby.sync(dir, {
    expandDirectories: {
      files: ['*.js', '*.ts'],
    },
    onlyFiles: true,
  })

  for (const path of paths) {
    const module: RouterModule | RouterModule[] = require(path).default
    if (Array.isArray(module)) {
      module.forEach((item) => {
        if (item.path) app.use(item.path, item.router)
      })
    } else if (module.path) {
      app.use(module.path, module.router)
    }
  }
}

export interface RegistedApi {
  path: string | RegExp
  method: string
  fullPath: string
  prefix?: string
  secured?: boolean
}

export const apis: RegistedApi[] = []

export const createApi = (router: Router, prefix: string = '/') => {
  const api = (
    method: 'get' | 'post' | 'put' | 'delete',
    path: string | RegExp,
    ...handlers: RequestHandler[]
  ) => {
    apis.push({
      prefix,
      path,
      fullPath: joinUrl(prefix, path as string),
      method,
      secured: !!handlers.find(
        (handler: any) => handler.id === MiddlewareId.hasApiPermission
      ),
    })
    ;(router as any)[method.toLowerCase()](path, ...handlers)
  }

  api.get = (path: string, ...handlers: RequestHandler[]) => {
    apis.push({
      prefix,
      path,
      fullPath: joinUrl(prefix, path),
      method: 'get',
      secured: !!handlers.find(
        (handler: any) => handler.id === MiddlewareId.hasApiPermission
      ),
    })

    router.get(path, ...handlers)
  }

  api.post = (path: string, ...handlers: RequestHandler[]) => {
    apis.push({
      prefix,
      path,
      fullPath: joinUrl(prefix, path),
      method: 'post',
      secured: !!handlers.find(
        (handler: any) => handler.id === MiddlewareId.hasApiPermission
      ),
    })
    router.post(path, ...handlers)
  }

  api.put = (path: string, ...handlers: RequestHandler[]) => {
    apis.push({
      prefix,
      path,
      fullPath: joinUrl(prefix, path),
      method: 'put',
      secured: !!handlers.find(
        (handler: any) => handler.id === MiddlewareId.hasApiPermission
      ),
    })
    router.put(path, ...handlers)
  }

  api.delete = (path: string, ...handlers: RequestHandler[]) => {
    apis.push({
      prefix,
      path,
      fullPath: joinUrl(prefix, path),
      method: 'delete',
      secured: !!handlers.find(
        (handler: any) => handler.id === MiddlewareId.hasApiPermission
      ),
    })
    router.delete(path, ...handlers)
  }

  api.router = router

  return api
}
