import path from 'path';
import fs from 'fs';
import { UPLOAD_PATH } from '@/server/constants';
import { kebabCase } from '@/utils/lodash';
import { nonAccentVietnamese } from '@/utils/utils';
import { ObjectId } from 'mongodb';
import multer from 'multer';
const storage = multer.diskStorage({
    destination: UPLOAD_PATH,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext);
        cb(null, new ObjectId().toHexString() +
            '-' +
            kebabCase(nonAccentVietnamese(filename)) +
            ext);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5Mb
});
const initFolder = () => {
    if (!fs.existsSync(UPLOAD_PATH)) {
        fs.mkdirSync(UPLOAD_PATH);
    }
    if (!fs.existsSync(path.join(UPLOAD_PATH, 'thumbnails'))) {
        fs.mkdirSync(path.join(UPLOAD_PATH, 'thumbnails'));
    }
};
export { upload, initFolder };
