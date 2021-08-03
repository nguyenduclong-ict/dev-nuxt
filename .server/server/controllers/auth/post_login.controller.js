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
import { comparePassword, createToken } from '@/server/helpers/crypt';
import { UNAUTHORIZED } from '@/server/helpers/errors';
import { tokenRepository, userRepository } from '@/server/repository';
import { toMongoId } from '@nguyenduclong/mongodbts';
import { dayjs } from '@/utils';
import { MinLength } from 'class-validator';
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
let PostLoginController = class PostLoginController extends Controller {
    async main() {
        const user = await userRepository.findOne({
            query: { username: this.params.username },
        });
        if (!user) {
            return this.sendError(UNAUTHORIZED, { message: 'User not exist' });
        }
        if (user.blocked) {
            return this.sendError(UNAUTHORIZED, { message: 'User is blocked' });
        }
        if (!comparePassword(this.params.password, user.password)) {
            return this.sendError(UNAUTHORIZED, { message: 'Incorrect password' });
        }
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
                type: 'refresh_token',
                value: refreshToken,
                expiresAt: dayjs().add(60, 'day').toDate(),
            },
        });
        this.res.json({ token, refreshToken });
    }
};
PostLoginController = __decorate([
    params(Params)
], PostLoginController);
export { PostLoginController };
