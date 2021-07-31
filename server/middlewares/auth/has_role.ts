import { sendError, FORBIDDEN } from '@/server/helpers/errors'
import { RequestHandler } from 'express'
import { MiddlewareId } from './const'

export function hasRole(...names: string[]): RequestHandler {
  return (req, res, next) => {
    if (req.meta?.user?.isAdmin) return next()
    const user = req.meta.user
    const roles = user.roles

    if (roles.find((role) => names.includes(role.name))) {
      return next()
    }

    sendError(res, FORBIDDEN, {
      message: 'You do not have the role to access the resource',
    })
  }
}

hasRole.id = MiddlewareId.hasRole
