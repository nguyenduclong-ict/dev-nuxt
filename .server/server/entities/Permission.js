var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PermissionAction, PermissionMethod, PermissionType, } from '@/server/constants/permission.enum';
import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts';
import { SchemaTypes } from 'mongoose';
let Permission = class Permission {
};
__decorate([
    Field({
        type: String,
        enum: Object.values(PermissionType),
        required: [true, 'Missing type for permission'],
    }),
    __metadata("design:type", String)
], Permission.prototype, "type", void 0);
__decorate([
    Field({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Permission.prototype, "isDefault", void 0);
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    Field({
        type: SchemaTypes.Mixed,
        validate: {
            validator: (v) => v.endpoint && Object.values(PermissionMethod).includes(v.method),
            message: 'Missing parameter for api permission',
        },
    }),
    __metadata("design:type", Object)
], Permission.prototype, "api", void 0);
__decorate([
    Field({
        type: SchemaTypes.Mixed,
        validate: {
            validator: (v) => v.name && Object.values(PermissionAction).includes(v.action),
            message: 'Missing parameter for entity permission',
        },
    }),
    __metadata("design:type", Object)
], Permission.prototype, "entity", void 0);
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], Permission.prototype, "page", void 0);
Permission = __decorate([
    Entity({ timestamps: true })
], Permission);
export { Permission };
let PermissionRepository = class PermissionRepository extends Repository {
};
PermissionRepository = __decorate([
    repository(Permission)
], PermissionRepository);
export { PermissionRepository };
