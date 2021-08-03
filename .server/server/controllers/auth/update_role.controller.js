var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, params } from '@/server/helpers/controller';
import { NOT_FOUND } from '@/server/helpers/errors';
import { roleRepository } from '@/server/repository';
import { IsObjectId } from '@nguyenduclong/mongodbts';
import { MinLength } from 'class-validator';
class Params {
}
__decorate([
    IsObjectId(),
    __metadata("design:type", String)
], Params.prototype, "id", void 0);
__decorate([
    MinLength(3),
    __metadata("design:type", String)
], Params.prototype, "name", void 0);
let UpdateRoleController = class UpdateRoleController extends Controller {
    async main() {
        const role = await roleRepository.findOne({
            query: {
                id: this.params.id,
            },
            populates: ['permissions'],
        });
        if (!role)
            return this.sendError(NOT_FOUND, { message: 'Role NotFound' });
        role.set('name', this.params.name);
        await role.save();
        this.res.json(role);
    }
};
UpdateRoleController = __decorate([
    params(Params)
], UpdateRoleController);
export { UpdateRoleController };
