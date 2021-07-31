import { Controller, params } from '@/server/helpers/controller'
import { createToken, hasPassword } from '@/server/helpers/crypt'
import { DefaultTokenData } from '@/server/middlewares/auth'
import {
  roleRepository,
  tokenRepository,
  userRepository,
} from '@/server/repository'
import { toMongoId } from '@nguyenduclong/mongodbts'
import { dayjs } from '@/utils'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator'

class Params {
  @MinLength(4)
  username: string

  @MinLength(4)
  password: string

  @IsOptional()
  @IsEmail()
  email: string

  @ValidateNested()
  @Type(() => ProfileParams)
  profile: {}
}

class ProfileParams {
  @IsOptional()
  @IsString()
  name: string
}

@params(Params)
export class PostRegisterController extends Controller<Params> {
  async main() {
    const role = await roleRepository.findOne({
      query: { isDefault: true, name: 'Authenticated' },
    })
    const user = await userRepository.create({
      data: {
        username: this.params.username,
        blocked: false,
        isAdmin: false,
        password: hasPassword(this.params.password),
        email: this.params.email,
        roles: [toMongoId(role)],
        permissions: [],
        profile: this.params.profile || {},
      },
    })

    const token = createToken<DefaultTokenData>({
      id: toMongoId(user.id),
      type: 'default',
    })

    const refreshToken = createToken(
      {
        id: toMongoId(user.id),
        type: 'refresh_token',
      },
      '60d'
    )

    await tokenRepository.create({
      data: {
        expiresAt: dayjs().add(60, 'day').toDate(),
        type: 'refresh_token',
        value: refreshToken,
      },
    })

    this.res.json({ token, refreshToken })
  }
}
