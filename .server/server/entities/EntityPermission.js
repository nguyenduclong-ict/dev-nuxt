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
import { Permission } from './Permission';
let EntityPermission = class EntityPermission {
};
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], EntityPermission.prototype, "entityName", void 0);
__decorate([
    Field({ type: SchemaTypes.ObjectId, refPath: 'entityName' }),
    __metadata("design:type", Object)
], EntityPermission.prototype, "entity", void 0);
__decorate([
    Field({ type: SchemaTypes.ObjectId, ref: 'Permission' }),
    __metadata("design:type", Permission)
], EntityPermission.prototype, "permission", void 0);
__decorate([
    Field({ type: Boolean }),
    __metadata("design:type", Boolean)
], EntityPermission.prototype, "isCreator", void 0);
__decorate([
    Field({ type: Boolean }),
    __metadata("design:type", Boolean)
], EntityPermission.prototype, "isSameRole", void 0);
EntityPermission = __decorate([
    Entity({ timestamps: true, autoIndex: true }),
    Index({ entityName: 1, permission: 1, entity: 1 })
], EntityPermission);
export { EntityPermission };
let EntityPermissionRepository = class EntityPermissionRepository extends Repository {
    test() {
    }
};
EntityPermissionRepository = __decorate([
    repository(EntityPermission)
], EntityPermissionRepository);
export { EntityPermissionRepository };
