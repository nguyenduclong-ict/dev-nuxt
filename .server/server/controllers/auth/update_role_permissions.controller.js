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
import { entityPermission, roleRepository } from '@/server/repository';
import { IsObjectId, toMongoId } from '@nguyenduclong/mongodbts';
import { IsArray, IsObject } from 'class-validator';
class Params {
}
__decorate([
    IsObjectId(),
    __metadata("design:type", Object)
], Params.prototype, "role", void 0);
__decorate([
    IsArray(),
    IsObject({ each: true }),
    __metadata("design:type", Array)
], Params.prototype, "permissions", void 0);
let UpdateRolePermissionsController = class UpdateRolePermissionsController extends Controller {
    async main() {
        const role = await roleRepository.findOne({
            query: {
                _id: this.params.role,
            },
        });
        if (!role)
            return this.sendError(NOT_FOUND, { message: 'Role not found' });
        // delete all old permission
        await entityPermission.delete({
            query: {
                entityName: 'Role',
                entity: this.params.role,
            },
        });
        // create new permission
        const permissions = await entityPermission.createMany({
            data: this.params.permissions.map((item) => {
                return {
                    entity: this.params.role,
                    entityName: 'Role',
                    permission: toMongoId(item.permission.id),
                    isCreator: item.isCreator,
                    isSameRole: item.isSameRole,
                };
            }),
        });
        this.res.json({
            ...role.toJSON(),
            permissions,
        });
    }
};
UpdateRolePermissionsController = __decorate([
    params(Params)
], UpdateRolePermissionsController);
export { UpdateRolePermissionsController };
