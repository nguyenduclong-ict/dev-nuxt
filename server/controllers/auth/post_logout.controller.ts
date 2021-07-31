import { Controller, params } from '@/server/helpers/controller'
import { tokenRepository } from '@/server/repository'
import { MinLength } from 'class-validator'

class Params {
  @MinLength(1)
  refreshToken: string
}

@params(Params)
export class PostLogoutController extends Controller<Params> {
  async main() {
    await tokenRepository.deleteOne({
      query: {
        type: 'refresh_token',
        value: this.params.refreshToken,
      },
    })

    this.res.send(true)
  }
}
