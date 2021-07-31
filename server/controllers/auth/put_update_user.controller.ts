import { Controller, Convert, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { userRepository } from '@/server/repository'
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator'

class Params {
  @IsString()
  username: string

  @IsOptional()
  @IsEmail()
  @Convert('falsy')
  email: string

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean

  @IsOptional()
  @IsBoolean()
  blocked: boolean

  @IsOptional()
  @IsString({ each: true })
  roles: string[]
}

@params(Params)
export class PutUpdateUserController extends Controller<Params> {
  async main() {
    const user = await userRepository.findOne({
      query: { username: this.params.username },
      fields: ['-password'],
      populates: [{ path: 'roles', justOne: false }],
    })

    if (!user) return this.sendError(NOT_FOUND, { message: 'User not found' })

    await user.updateOne({
      email: this.params.email,
      isAdmin: this.params.isAdmin,
      blocked: this.params.blocked,
      roles: this.params.roles as any,
    })

    return this.res.json(user)
  }
}
