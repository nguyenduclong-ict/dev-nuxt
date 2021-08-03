var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PermissionType } from '@/server/constants';
import { Controller, params } from '@/server/helpers/controller';
import { createIfNotExits } from '@/server/helpers/repository';
import { permissionRepository } from '@/server/repository';
import { IsArray } from 'class-validator';
class Params {
}
__decorate([
    IsArray(),
    __metadata("design:type", Array)
], Params.prototype, "pages", void 0);
let UpdatePagesController = class UpdatePagesController extends Controller {
    async main() {
        const permissions = await Promise.all(this.params.pages.map((page) => {
            return createIfNotExits(permissionRepository, {
                isDefault: true,
                type: PermissionType.PAGE,
                page: page.name,
            }, {
                isDefault: true,
                type: PermissionType.PAGE,
                page: page.name,
            }, () => {
                console.log('create permission [page]:', page.name);
            });
        }));
        this.res.json(permissions);
    }
};
UpdatePagesController = __decorate([
    params(Params)
], UpdatePagesController);
export { UpdatePagesController };
