import { Controller, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { roleRepository } from '@/server/repository'
import { IsObjectId } from '@nguyenduclong/mongodbts'
import { MinLength } from 'class-validator'

class Params {
  @IsObjectId()
  id: string

  @MinLength(3)
  name: string
}

@params(Params)
export class UpdateRoleController extends Controller<Params> {
  async main() {
    const role = await roleRepository.findOne({
      query: {
        id: this.params.id,
      },
      populates: ['permissions'],
    })

    if (!role) return this.sendError(NOT_FOUND, { message: 'Role NotFound' })

    role.set('name', this.params.name)
    await role.save()

    this.res.json(role)
  }
}
