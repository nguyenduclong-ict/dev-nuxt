var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { connection } from '@/server/config/mongo';
import { Controller, params } from '@/server/helpers/controller';
import { NOT_FOUND } from '@/server/helpers/errors';
import { entityPermission, userRepository } from '@/server/repository';
import { IsObjectId, toMongoId } from '@nguyenduclong/mongodbts';
import { IsArray, IsObject } from 'class-validator';
class Params {
}
__decorate([
    IsObjectId(),
    __metadata("design:type", Object)
], Params.prototype, "user", void 0);
__decorate([
    IsArray(),
    IsObject({ each: true }),
    __metadata("design:type", Array)
], Params.prototype, "permissions", void 0);
let UpdateUserPermissionsController = class UpdateUserPermissionsController extends Controller {
    async main() {
        const user = await userRepository.findOne({
            query: {
                _id: this.params.user,
            },
        });
        if (!user)
            return this.sendError(NOT_FOUND, { message: 'User not found' });
        const session = await connection.startSession();
        await session.withTransaction(async () => {
            // delete all old permission
            await entityPermission.delete({
                query: {
                    entityName: 'User',
                    entity: this.params.user,
                },
            });
            // create new permission
            const permissions = await entityPermission.createMany({
                data: this.params.permissions.map((item) => {
                    return {
                        entity: this.params.user,
                        entityName: 'User',
                        permission: toMongoId(item.permission.id),
                        isCreator: item.isCreator,
                        isSameRole: item.isSameRole,
                    };
                }),
            });
            this.res.json({
                ...user.toJSON(),
                permissions,
            });
        });
    }
};
UpdateUserPermissionsController = __decorate([
    params(Params)
], UpdateUserPermissionsController);
export { UpdateUserPermissionsController };
