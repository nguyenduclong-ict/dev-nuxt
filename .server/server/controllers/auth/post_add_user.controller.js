var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DefaultRole } from '@/server/entities';
import { Controller, params } from '@/server/helpers/controller';
import { hasPassword } from '@/server/helpers/crypt';
import { ENTITY_EXIST, FORBIDDEN } from '@/server/helpers/errors';
import { roleRepository, userRepository } from '@/server/repository';
import { idIsEqual, toMongoId } from '@nguyenduclong/mongodbts';
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength, } from 'class-validator';
class Params {
}
__decorate([
    MinLength(4),
    __metadata("design:type", String)
], Params.prototype, "username", void 0);
__decorate([
    MinLength(4),
    __metadata("design:type", String)
], Params.prototype, "password", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], Params.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], Params.prototype, "blocked", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], Params.prototype, "isAdmin", void 0);
__decorate([
    IsString({ each: true }),
    __metadata("design:type", Array)
], Params.prototype, "roles", void 0);
let PostAddUserController = class PostAddUserController extends Controller {
    async main() {
        if (await userRepository.findOne({
            query: { username: this.params.username },
        })) {
            return this.sendError(ENTITY_EXIST);
        }
        const authenticatedRole = await roleRepository.findOne({
            query: {
                isDefault: true,
                name: DefaultRole.AUTHENTIACATED,
            },
        });
        if (!this.params.roles.find((e) => idIsEqual(e, authenticatedRole.id))) {
            this.params.roles.push(toMongoId(authenticatedRole.id));
        }
        if (this.params.isAdmin && !this.req.meta.user.isAdmin) {
            return this.sendError(FORBIDDEN);
        }
        const user = await userRepository.create({
            data: {
                ...this.params,
                password: hasPassword(this.params.password),
                blocked: this.params.blocked,
                profile: {},
                permissions: [],
            },
            populates: ['roles'],
        });
        this.res.json(user);
    }
};
PostAddUserController = __decorate([
    params(Params)
], PostAddUserController);
export { PostAddUserController };
