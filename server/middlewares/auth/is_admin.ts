import { FORBIDDEN, sendError } from '@/server/helpers/errors'
import { RequestHandler } from 'express'

export const isAdmin: RequestHandler = (req, res, next) => {
  if (req.meta.auth.isAdmin) return next()
  return sendError(res, FORBIDDEN)
}
