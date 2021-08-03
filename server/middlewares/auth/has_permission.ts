import { PermissionType, PermissionAction } from '@/server/constants'
import { Permission, EntityPermissionOptions } from '@/server/entities'
import { sendError, FORBIDDEN, UNAUTHORIZED } from '@/server/helpers/errors'
import { ValueOf } from '@/server/helpers/interface'
import { RequestHandler } from 'express'
import { match } from 'path-to-regexp'
import { MiddlewareId } from './const'

export function hasPermission(
  ...names: (
    | string
    | Partial<Permission>
    | [string | Partial<Permission>, EntityPermissionOptions]
  )[]
): RequestHandler {
  const middleware = function (req, res, next) {
    const auth = req.meta.auth
    if (req.meta.user.isAdmin) return next()
    if (!names.length) return next()
    if (auth.hasPermission(...names)) return next()

    sendError(res, FORBIDDEN, {
      message: 'You do not have the permission to access the resource',
    })
  }

  middleware.id = MiddlewareId.hasPermission
  return middleware
}

export const hasApiPermission: RequestHandler = function (req, res, next) {
  const auth = req.meta.auth

  if (auth.isAdmin) return next()
  const method = req.method.toLowerCase()

  const permission = auth.permissions.find(({ permission: item }) => {
    return (
      item.type === PermissionType.API &&
      item.api?.method === method &&
      match(item.api?.endpoint)(req.meta.endpoint)
    )
  })

  if (!permission) return sendError(res, FORBIDDEN)

  next()
}

// Check use has one of permission in list
export const hasEntityPermission = (
  entity: string,
  ...actions: ValueOf<typeof PermissionAction>[]
): RequestHandler =>
  async function (req, res, next) {
    const auth = req.meta.auth

    if (!auth) return sendError(res, UNAUTHORIZED)

    if (auth.isAdmin) return next()
    // if (!auth.isAuthenticated) return sendError(res, FORBIDDEN)
    const permission = auth.hasPermission(
      ...actions.map((action) => ({
        type: PermissionType.ENTITY,
        entity: { name: entity, action },
      }))
    )

    if (permission) {
      if (permission !== true) {
        req.meta.isCreator = permission.isCreator
        req.meta.isSameRole = permission.isSameRole
      }

      return next()
    }

    sendError(res, FORBIDDEN)
  }

// set Id
hasEntityPermission.id = MiddlewareId.hasEntityPermission
;(hasApiPermission as any).id = MiddlewareId.hasApiPermission
