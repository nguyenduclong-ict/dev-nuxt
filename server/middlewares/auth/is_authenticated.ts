import { sendError } from '@/server/helpers/errors'
import { RequestHandler } from 'express'
import { GetUserInfo } from './get_user_info'

export type DefaultTokenData = { id: string; type: 'default' }
export type RefreshTokenData = { id: string; type: 'refresh_token' }

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.meta.__get_user_info__) {
    await (GetUserInfo as any)(req)
  }

  if (req.meta.__get_user_info_error__) {
    return sendError(res, req.meta.__get_user_info_error__)
  }

  next()
}
