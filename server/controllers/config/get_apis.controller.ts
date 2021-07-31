import { Controller, params } from '@/server/helpers/controller'
import { apis } from '@/server/helpers/router'

class Params {}

@params(Params)
export class GetApisController extends Controller<Params> {
  async main() {
    this.res.json(apis)
  }
}
