import { Controller, params } from '@/server/helpers/controller'
import { createToken, verifyToken } from '@/server/helpers/crypt'
import { INVALID_TOKEN } from '@/server/helpers/errors'
import { DefaultTokenData, RefreshTokenData } from '@/server/middlewares/auth'
import { tokenRepository } from '@/server/repository'
import { MinLength } from 'class-validator'
import { isValidObjectId } from 'mongoose'

class Params {
  @MinLength(1, { message: 'Invalid Token' })
  refreshToken: string
}

@params(Params)
export class PostRefreshTokenController extends Controller<Params> {
  async main() {
    const _token = await tokenRepository.findOne({
      query: {
        value: this.params.refreshToken,
        expiresAt: {
          $gte: new Date(),
        },
      },
    })

    if (!_token) {
      return this.sendError(INVALID_TOKEN, { message: 'Token NotFound' })
    }

    let refreshTokenData: RefreshTokenData

    try {
      refreshTokenData = verifyToken<RefreshTokenData>(this.params.refreshToken)
    } catch (error) {
      return this.sendError(INVALID_TOKEN, {
        message: error.message,
        type: error.name,
      })
    }

    if (
      !refreshTokenData ||
      refreshTokenData.type !== 'refresh_token' ||
      !refreshTokenData.id ||
      !isValidObjectId(refreshTokenData.id)
    ) {
      return this.sendError(INVALID_TOKEN)
    }

    const token = createToken<DefaultTokenData>({
      id: refreshTokenData.id,
      type: 'default',
    })

    this.res.json({
      token,
    })
  }
}
