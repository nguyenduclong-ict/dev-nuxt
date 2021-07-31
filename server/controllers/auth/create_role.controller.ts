import { Controller, params } from '@/server/helpers/controller'
import { ENTITY_EXIST } from '@/server/helpers/errors'
import { roleRepository } from '@/server/repository'
import { MinLength } from 'class-validator'

class Params {
  @MinLength(3)
  name: string
}

@params(Params)
export class CreateRoleController extends Controller<Params> {
  async main() {
    const exists = await roleRepository.findOne({
      query: {
        name: this.params.name,
      },
    })

    if (exists) return this.sendError(ENTITY_EXIST)

    const role = await roleRepository.create({
      data: {
        name: this.params.name,
        isDefault: false,
        permissions: [],
      },
      populates: ['permissions'],
    })

    this.res.json(role)
  }
}
