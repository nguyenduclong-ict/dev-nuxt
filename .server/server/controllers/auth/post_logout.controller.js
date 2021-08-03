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
import { tokenRepository } from '@/server/repository';
import { MinLength } from 'class-validator';
class Params {
}
__decorate([
    MinLength(1),
    __metadata("design:type", String)
], Params.prototype, "refreshToken", void 0);
let PostLogoutController = class PostLogoutController extends Controller {
    async main() {
        await tokenRepository.deleteOne({
            query: {
                type: 'refresh_token',
                value: this.params.refreshToken,
            },
        });
        this.res.send(true);
    }
};
PostLogoutController = __decorate([
    params(Params)
], PostLogoutController);
export { PostLogoutController };
