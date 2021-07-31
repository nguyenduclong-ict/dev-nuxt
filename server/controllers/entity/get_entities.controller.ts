import { Controller, params } from '@/server/helpers/controller'
import { EntityHelper } from '@/server/helpers/repository'

class Params {}

@params(Params)
export class GetEntitiesController extends Controller<Params> {
  async main() {
    this.res.json(EntityHelper.getEntities())
  }
}
