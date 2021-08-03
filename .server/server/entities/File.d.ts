import { Repository } from '@nguyenduclong/mongodbts';
interface FileThumbnail {
    path?: string;
    width?: number;
    height?: number;
    size?: number;
}
export declare class File {
    id?: any;
    _id?: any;
    name: string;
    path: string;
    mimetype: string;
    public: boolean;
    thumbnails: FileThumbnail[];
    size: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class FileRepository extends Repository<File> {
}
export {};
