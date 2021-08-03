var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Convert, params } from '@/server/helpers/controller';
import { NOT_FOUND } from '@/server/helpers/errors';
import { userRepository } from '@/server/repository';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
class Params {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], Params.prototype, "username", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    Convert('falsy'),
    __metadata("design:type", String)
], Params.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], Params.prototype, "isAdmin", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], Params.prototype, "blocked", void 0);
__decorate([
    IsOptional(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], Params.prototype, "roles", void 0);
let PutUpdateUserController = class PutUpdateUserController extends Controller {
    async main() {
        const user = await userRepository.findOne({
            query: { username: this.params.username },
            fields: ['-password'],
            populates: [{ path: 'roles', justOne: false }],
        });
        if (!user)
            return this.sendError(NOT_FOUND, { message: 'User not found' });
        await user.updateOne({
            email: this.params.email,
            isAdmin: this.params.isAdmin,
            blocked: this.params.blocked,
            roles: this.params.roles,
        });
        return this.res.json(user);
    }
};
PutUpdateUserController = __decorate([
    params(Params)
], PutUpdateUserController);
export { PutUpdateUserController };
