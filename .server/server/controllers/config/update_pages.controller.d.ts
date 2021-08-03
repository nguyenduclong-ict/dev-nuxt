import { Controller } from '@/server/helpers/controller';
declare class Params {
    pages: {
        path: string;
        name: string;
    }[];
}
export declare class UpdatePagesController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
