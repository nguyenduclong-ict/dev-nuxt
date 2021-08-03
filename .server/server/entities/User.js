var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, Index, Repository, repository, } from '@nguyenduclong/mongodbts';
import { SchemaTypes } from 'mongoose';
import { FieldOption } from '../helpers/repository';
let User = class User {
};
__decorate([
    Field({ type: String, minlength: 4, unique: true, required: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Field({ type: String, minlength: 6 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Field({ type: String }),
    FieldOption({ type: 'filepicker' }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "blocked", void 0);
__decorate([
    Field({ type: SchemaTypes.Mixed, default: {} }),
    __metadata("design:type", Object)
], User.prototype, "profile", void 0);
__decorate([
    Field([{ type: SchemaTypes.ObjectId, ref: 'Role' }]),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
User = __decorate([
    Entity({ timestamps: true, description: 'Tài khoản người dùng' }),
    Index({ username: 1 })
], User);
export { User };
let UserRepository = class UserRepository extends Repository {
    onCreateSchema(schema) {
        schema.virtual('permissions', {
            ref: 'EntityPermission',
            foreignField: 'entity',
            localField: '_id',
            justOne: false,
        });
        return schema;
    }
};
UserRepository = __decorate([
    repository(User)
], UserRepository);
export { UserRepository };
