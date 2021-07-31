import { PermissionType } from '@/server/constants'
import { Controller, params } from '@/server/helpers/controller'
import { createIfNotExits } from '@/server/helpers/repository'
import { permissionRepository } from '@/server/repository'
import { IsArray } from 'class-validator'

class Params {
  @IsArray()
  pages: { path: string; name: string }[]
}

@params(Params)
export class UpdatePagesController extends Controller<Params> {
  async main() {
    const permissions = await Promise.all(
      this.params.pages.map((page) => {
        return createIfNotExits(
          permissionRepository,
          {
            isDefault: true,
            type: PermissionType.PAGE,
            page: page.name,
          },
          {
            isDefault: true,
            type: PermissionType.PAGE,
            page: page.name,
          },
          () => {
            console.log('create permission [page]:', page.name)
          }
        )
      })
    )

    this.res.json(permissions)
  }
}
