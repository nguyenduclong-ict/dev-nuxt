import { EntityPermission } from '@/server/entities'
import { Controller, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { entityPermission, roleRepository } from '@/server/repository'
import { IsObjectId, toMongoId } from '@nguyenduclong/mongodbts'
import { IsArray, IsObject } from 'class-validator'

class Params {
  @IsObjectId()
  role: any

  @IsArray()
  @IsObject({ each: true })
  permissions: EntityPermission[]
}

@params(Params)
export class UpdateRolePermissionsController extends Controller<Params> {
  async main() {
    const role = await roleRepository.findOne({
      query: {
        _id: this.params.role,
      },
    })

    if (!role) return this.sendError(NOT_FOUND, { message: 'Role not found' })

    // delete all old permission
    await entityPermission.delete({
      query: {
        entityName: 'Role',
        entity: this.params.role,
      },
    })

    // create new permission

    const permissions = await entityPermission.createMany({
      data: this.params.permissions.map((item) => {
        return {
          entity: this.params.role,
          entityName: 'Role',
          permission: toMongoId(item.permission.id),
          isCreator: item.isCreator,
          isSameRole: item.isSameRole,
        }
      }),
    })

    this.res.json({
      ...role.toJSON(),
      permissions,
    })
  }
}
