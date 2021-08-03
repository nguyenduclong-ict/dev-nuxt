import { connection } from '@/server/config/mongo'
import { EntityPermission } from '@/server/entities'
import { Controller, params } from '@/server/helpers/controller'
import { NOT_FOUND } from '@/server/helpers/errors'
import { entityPermission, userRepository } from '@/server/repository'
import { IsObjectId, toMongoId } from '@nguyenduclong/mongodbts'
import { IsArray, IsObject } from 'class-validator'

class Params {
  @IsObjectId()
  user: any

  @IsArray()
  @IsObject({ each: true })
  permissions: EntityPermission[]
}

@params(Params)
export class UpdateUserPermissionsController extends Controller<Params> {
  async main() {
    const user = await userRepository.findOne({
      query: {
        _id: this.params.user,
      },
    })

    if (!user) return this.sendError(NOT_FOUND, { message: 'User not found' })
    const session = await connection.startSession()

    await session.withTransaction(async () => {
      // delete all old permission
      await entityPermission.delete({
        query: {
          entityName: 'User',
          entity: this.params.user,
        },
      })

      // create new permission

      const permissions = await entityPermission.createMany({
        data: this.params.permissions.map((item) => {
          return {
            entity: this.params.user,
            entityName: 'User',
            permission: toMongoId(item.permission.id),
            isCreator: item.isCreator,
            isSameRole: item.isSameRole,
          }
        }),
      })

      console.log(permissions)

      this.res.json({
        ...user.toJSON(),
        permissions,
      })
    })
  }
}
