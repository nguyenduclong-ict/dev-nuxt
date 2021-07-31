import { Controller, params } from '@/server/helpers/controller'
import { comparePassword, createToken } from '@/server/helpers/crypt'
import { UNAUTHORIZED } from '@/server/helpers/errors'
import { DefaultTokenData, RefreshTokenData } from '@/server/middlewares/auth'
import { tokenRepository, userRepository } from '@/server/repository'
import { toMongoId } from '@nguyenduclong/mongodbts'
import { dayjs } from '@/utils'
import { MinLength } from 'class-validator'

class Params {
  @MinLength(4)
  username: string

  @MinLength(4)
  password: string
}

@params(Params)
export class PostLoginController extends Controller<Params> {
  async main() {
    const user = await userRepository.findOne({
      query: { username: this.params.username },
    })

    if (!user) {
      return this.sendError(UNAUTHORIZED, { message: 'User not exist' })
    }

    if (user.blocked) {
      return this.sendError(UNAUTHORIZED, { message: 'User is blocked' })
    }

    if (!comparePassword(this.params.password, user.password)) {
      return this.sendError(UNAUTHORIZED, { message: 'Incorrect password' })
    }

    const token = createToken<DefaultTokenData>({
      id: toMongoId(user.id),
      type: 'default',
    })

    const refreshToken = createToken<RefreshTokenData>(
      {
        id: toMongoId(user.id),
        type: 'refresh_token',
      },
      '60d'
    )

    await tokenRepository.create({
      data: {
        type: 'refresh_token',
        value: refreshToken,
        expiresAt: dayjs().add(60, 'day').toDate(),
      },
    })

    this.res.json({ token, refreshToken })
  }
}
