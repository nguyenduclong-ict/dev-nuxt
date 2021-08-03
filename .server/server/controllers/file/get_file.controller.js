var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import fs from 'fs';
import path from 'path';
import { UPLOAD_PATH } from '@/server/constants';
import { Controller, params } from '@/server/helpers/controller';
import { NOT_FOUND } from '@/server/helpers/errors';
import { fileRepository } from '@/server/repository';
import sharp from 'sharp';
class Params {
}
let GetFileController = class GetFileController extends Controller {
    async main() {
        const file = await fileRepository.findOne({
            query: {
                name: this.params.name,
            },
            meta: this.req.meta,
        });
        if (!file)
            return this.sendError(NOT_FOUND, { message: 'File NotFound' });
        if (this.params.thumbnail)
            return this.sendThumbnail(file);
        else
            return this.sendFile(file);
    }
    sendThumbnail(file) {
        var _a;
        let [w, h] = (_a = this.params.thumbnail) === null || _a === void 0 ? void 0 : _a.split('x');
        if (!w) {
            return this.sendFileWithPath(file.path, file.mimetype);
        }
        w = +w;
        h = +h || null;
        const thumb = file.thumbnails.find((e) => e.width === w && (e.height || null) === h);
        if (thumb) {
            this.sendFileWithPath(thumb.path, file.mimetype);
        }
        else {
            const fileExt = path.extname(file.name);
            const filename = path.basename(file.name, fileExt);
            const thumbName = filename + `_${w}x${h}${fileExt}`;
            const thumbPath = path.resolve(UPLOAD_PATH, 'thumbnails', thumbName);
            sharp(path.join(UPLOAD_PATH, file.path))
                .resize(w, h, { fit: 'cover' })
                .toFile(thumbPath)
                .then((data) => {
                return fileRepository.updateOne({
                    query: {
                        id: file.id,
                    },
                    data: {
                        $push: {
                            thumbnails: {
                                width: w,
                                height: h,
                                path: thumbName,
                                size: data.size,
                            },
                        },
                    },
                });
            })
                .then(() => this.sendFileWithPath(path.join('thumbnails', thumbName), file.mimetype));
        }
    }
    sendFile(file) {
        return this.sendFileWithPath(file.path, file.mimetype);
    }
    sendFileWithPath(filePath, mimetype) {
        return fs.promises
            .readFile(path.join(UPLOAD_PATH, filePath))
            .then((buffer) => {
            this.res.contentType(mimetype).end(buffer);
        })
            .catch((error) => {
            console.log(error);
            this.sendError(NOT_FOUND);
        });
    }
};
GetFileController = __decorate([
    params(Params)
], GetFileController);
export { GetFileController };
