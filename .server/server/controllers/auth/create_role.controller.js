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
import { ENTITY_EXIST } from '@/server/helpers/errors';
import { roleRepository } from '@/server/repository';
import { MinLength } from 'class-validator';
class Params {
}
__decorate([
    MinLength(3),
    __metadata("design:type", String)
], Params.prototype, "name", void 0);
let CreateRoleController = class CreateRoleController extends Controller {
    async main() {
        const exists = await roleRepository.findOne({
            query: {
                name: this.params.name,
            },
        });
        if (exists)
            return this.sendError(ENTITY_EXIST);
        const role = await roleRepository.create({
            data: {
                name: this.params.name,
                isDefault: false,
                permissions: [],
            },
            populates: ['permissions'],
        });
        this.res.json(role);
    }
};
CreateRoleController = __decorate([
    params(Params)
], CreateRoleController);
export { CreateRoleController };
