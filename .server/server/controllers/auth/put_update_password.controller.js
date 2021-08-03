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
import { hasPassword } from '@/server/helpers/crypt';
import { NOT_FOUND } from '@/server/helpers/errors';
import { userRepository } from '@/server/repository';
import { IsString, MinLength } from 'class-validator';
class Params {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], Params.prototype, "username", void 0);
__decorate([
    MinLength(4),
    __metadata("design:type", String)
], Params.prototype, "password", void 0);
let PutUpdatePasswordController = class PutUpdatePasswordController extends Controller {
    async main() {
        const user = await userRepository.findOne({
            query: {
                username: this.params.username,
            },
        });
        if (!user)
            return this.sendError(NOT_FOUND, { message: 'User not found' });
        await user.updateOne({
            $set: {
                password: hasPassword(this.params.password),
            },
        });
        this.res.json({ success: true });
    }
};
PutUpdatePasswordController = __decorate([
    params(Params)
], PutUpdatePasswordController);
export { PutUpdatePasswordController };
