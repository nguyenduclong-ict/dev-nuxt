import { PermissionType } from '@/server/constants'
import { Controller, params } from '@/server/helpers/controller'
import { PermissionHelper } from '@/server/helpers/permission'
import { EntityHelper } from '@/server/helpers/repository'

class Params {}

@params(Params)
export class GetEntitiesOfMeController extends Controller<Params> {
  async main() {
    const checker = new PermissionHelper(this.req.meta.user)
    this.res.json(
      EntityHelper.getEntities().filter((item) => {
        return checker.hasPermission({
          type: PermissionType.ENTITY,
          entity: { name: item.name } as any,
        })
      })
    )
  }
}
