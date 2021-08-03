var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { author } from '@/server/helpers/repository';
import { Entity, Field, Repository, repository } from '@nguyenduclong/mongodbts';
import { SchemaTypes } from 'mongoose';
let File = class File {
};
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    Field({ type: String, required: true }),
    __metadata("design:type", String)
], File.prototype, "path", void 0);
__decorate([
    Field({ type: String }),
    __metadata("design:type", String)
], File.prototype, "mimetype", void 0);
__decorate([
    Field({ type: Boolean }),
    __metadata("design:type", Boolean)
], File.prototype, "public", void 0);
__decorate([
    Field({ type: SchemaTypes.Mixed, default: [] }),
    __metadata("design:type", Array)
], File.prototype, "thumbnails", void 0);
__decorate([
    Field({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
File = __decorate([
    Entity({ timestamps: true })
], File);
export { File };
let FileRepository = class FileRepository extends Repository {
};
FileRepository = __decorate([
    repository(File),
    author()
], FileRepository);
export { FileRepository };
