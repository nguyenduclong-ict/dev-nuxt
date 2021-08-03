var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { UPLOAD_PATH } from '@/server/constants';
import { Controller, params } from '@/server/helpers/controller';
import { fileRepository } from '@/server/repository';
class Params {
}
let UploadSingleController = class UploadSingleController extends Controller {
    async main() {
        const file = await fileRepository.create({
            data: {
                name: this.req.file.filename,
                path: this.req.file.path.replace(new RegExp('^' + UPLOAD_PATH), ''),
                public: true,
                mimetype: this.req.file.mimetype,
                thumbnails: [],
                size: this.req.file.size,
            },
            meta: this.req.meta,
        });
        this.res.json(file);
    }
};
UploadSingleController = __decorate([
    params(Params)
], UploadSingleController);
export { UploadSingleController };
