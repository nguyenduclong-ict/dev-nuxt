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
import { createToken, hasPassword } from '@/server/helpers/crypt';
import { roleRepository, tokenRepository, userRepository, } from '@/server/repository';
import { toMongoId } from '@nguyenduclong/mongodbts';
import { dayjs } from '@/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength, ValidateNested, } from 'class-validator';
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
    ValidateNested(),
    Type(() => ProfileParams),
    __metadata("design:type", Object)
], Params.prototype, "profile", void 0);
class ProfileParams {
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ProfileParams.prototype, "name", void 0);
let PostRegisterController = class PostRegisterController extends Controller {
    async main() {
        const role = await roleRepository.findOne({
            query: { isDefault: true, name: 'Authenticated' },
        });
        const user = await userRepository.create({
            data: {
                username: this.params.username,
                blocked: false,
                isAdmin: false,
                password: hasPassword(this.params.password),
                email: this.params.email,
                roles: [toMongoId(role)],
                permissions: [],
                profile: this.params.profile || {},
            },
        });
        const token = createToken({
            id: toMongoId(user.id),
            type: 'default',
        });
        const refreshToken = createToken({
            id: toMongoId(user.id),
            type: 'refresh_token',
        }, '60d');
        await tokenRepository.create({
            data: {
                expiresAt: dayjs().add(60, 'day').toDate(),
                type: 'refresh_token',
                value: refreshToken,
            },
        });
        this.res.json({ token, refreshToken });
    }
};
PostRegisterController = __decorate([
    params(Params)
], PostRegisterController);
export { PostRegisterController };
