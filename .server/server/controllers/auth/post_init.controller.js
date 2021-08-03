var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, createRollback, params } from '@/server/helpers/controller';
import { createToken, hasPassword } from '@/server/helpers/crypt';
import { ENTITY_EXIST } from '@/server/helpers/errors';
import { configRepository, permissionRepository, roleRepository, tokenRepository, userRepository, } from '@/server/repository';
import { dayjs } from '@/utils';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { toMongoId } from '@nguyenduclong/mongodbts';
import { initRolesAndPermissions } from '@/server/seeders/roles_permissions';
class Params {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], Params.prototype, "projectName", void 0);
__decorate([
    MinLength(4),
    __metadata("design:type", String)
], Params.prototype, "username", void 0);
__decorate([
    MinLength(4),
    __metadata("design:type", String)
], Params.prototype, "password", void 0);
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], Params.prototype, "email", void 0);
let PostInitController = class PostInitController extends Controller {
    async main() {
        const rollback = createRollback();
        try {
            if (await configRepository.findOne({ query: { key: 'project' } })) {
                return this.sendError(ENTITY_EXIST, { message: 'Project existed!' });
            }
            const project = await configRepository.create({
                data: {
                    key: 'project',
                    value: {
                        name: this.params.projectName,
                    },
                },
            });
            rollback.add(() => project.remove());
            if (await userRepository.findOne({
                query: { username: this.params.username },
            })) {
                await rollback.run();
                this.sendError(ENTITY_EXIST, { message: 'User existed!' });
            }
            const user = await userRepository.create({
                data: {
                    username: this.params.username,
                    blocked: false,
                    isAdmin: true,
                    password: hasPassword(this.params.password),
                    email: this.params.email,
                    roles: [],
                    permissions: [],
                    profile: {},
                },
            });
            rollback.add(() => user.remove());
            // clear database
            await Promise.all([
                permissionRepository.delete({ query: {} }),
                roleRepository.delete({ query: {} }),
                tokenRepository.delete({ query: {} }),
            ]);
            // create base role
            await initRolesAndPermissions();
            // create login token
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
        catch (error) {
            await rollback.run();
            throw error;
        }
    }
};
PostInitController = __decorate([
    params(Params)
], PostInitController);
export { PostInitController };
