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
import { createToken, verifyToken } from '@/server/helpers/crypt';
import { INVALID_TOKEN } from '@/server/helpers/errors';
import { tokenRepository } from '@/server/repository';
import { MinLength } from 'class-validator';
import { isValidObjectId } from 'mongoose';
class Params {
}
__decorate([
    MinLength(1, { message: 'Invalid Token' }),
    __metadata("design:type", String)
], Params.prototype, "refreshToken", void 0);
let PostRefreshTokenController = class PostRefreshTokenController extends Controller {
    async main() {
        const _token = await tokenRepository.findOne({
            query: {
                value: this.params.refreshToken,
                expiresAt: {
                    $gte: new Date(),
                },
            },
        });
        if (!_token) {
            return this.sendError(INVALID_TOKEN, { message: 'Token NotFound' });
        }
        let refreshTokenData;
        try {
            refreshTokenData = verifyToken(this.params.refreshToken);
        }
        catch (error) {
            return this.sendError(INVALID_TOKEN, {
                message: error.message,
                type: error.name,
            });
        }
        if (!refreshTokenData ||
            refreshTokenData.type !== 'refresh_token' ||
            !refreshTokenData.id ||
            !isValidObjectId(refreshTokenData.id)) {
            return this.sendError(INVALID_TOKEN);
        }
        const token = createToken({
            id: refreshTokenData.id,
            type: 'default',
        });
        this.res.json({
            token,
        });
    }
};
PostRefreshTokenController = __decorate([
    params(Params)
], PostRefreshTokenController);
export { PostRefreshTokenController };
