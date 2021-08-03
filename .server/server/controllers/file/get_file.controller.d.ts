import { Controller } from '@/server/helpers/controller';
import { File } from '@/server/entities';
declare class Params {
    name: string;
    thumbnail: string;
}
export declare class GetFileController extends Controller<Params> {
    main(): Promise<void>;
    sendThumbnail(file: File): Promise<void>;
    sendFile(file: File): Promise<void>;
    sendFileWithPath(filePath: string, mimetype: string): Promise<void>;
}
export {};
