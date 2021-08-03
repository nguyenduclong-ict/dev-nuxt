var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { PermissionType } from '@/server/constants';
import { Controller, params } from '@/server/helpers/controller';
import { PermissionHelper } from '@/server/helpers/permission';
import { EntityHelper } from '@/server/helpers/repository';
class Params {
}
let GetEntitiesOfMeController = class GetEntitiesOfMeController extends Controller {
    async main() {
        const checker = new PermissionHelper(this.req.meta.user);
        this.res.json(EntityHelper.getEntities().filter((item) => {
            return checker.hasPermission({
                type: PermissionType.ENTITY,
                entity: { name: item.name },
            });
        }));
    }
};
GetEntitiesOfMeController = __decorate([
    params(Params)
], GetEntitiesOfMeController);
export { GetEntitiesOfMeController };
