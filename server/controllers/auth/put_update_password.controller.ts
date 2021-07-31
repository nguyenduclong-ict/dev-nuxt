import { Controller, params } from '@/server/helpers/controller'
import { hasPassword } from '@/server/helpers/crypt'
import { NOT_FOUND } from '@/server/helpers/errors'
import { userRepository } from '@/server/repository'
import { IsString, MinLength } from 'class-validator'

class Params {
  @IsString()
  username: string

  @MinLength(4)
  password: string
}

@params(Params)
export class PutUpdatePasswordController extends Controller<Params> {
  async main() {
    const user = await userRepository.findOne({
      query: {
        username: this.params.username,
      },
    })

    if (!user) return this.sendError(NOT_FOUND, { message: 'User not found' })

    await user.updateOne({
      $set: {
        password: hasPassword(this.params.password),
      },
    })

    this.res.json({ success: true })
  }
}
