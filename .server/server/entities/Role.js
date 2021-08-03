var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts';
export var DefaultRole;
(function (DefaultRole) {
    DefaultRole["ADMIN"] = "Admin";
    DefaultRole["WRITER"] = "Writer";
    DefaultRole["AUTHENTIACATED"] = "Authenticated";
    DefaultRole["GUEST"] = "Guest";
})(DefaultRole || (DefaultRole = {}));
let Role = class Role {
};
__decorate([
    Field({ type: String, unique: true, required: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Role.prototype, "isDefault", void 0);
Role = __decorate([
    Entity({ timestamps: true })
], Role);
export { Role };
let RoleRepository = class RoleRepository extends Repository {
    onCreateSchema(schema) {
        schema.virtual('permissions', {
            ref: 'EntityPermission',
            foreignField: 'entity',
            localField: '_id',
        });
        return schema;
    }
};
RoleRepository = __decorate([
    repository(Role)
], RoleRepository);
export { RoleRepository };
