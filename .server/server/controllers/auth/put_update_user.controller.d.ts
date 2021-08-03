import { Controller } from '@/server/helpers/controller';
declare class Params {
    username: string;
    email: string;
    isAdmin: boolean;
    blocked: boolean;
    roles: string[];
}
export declare class PutUpdateUserController extends Controller<Params> {
    main(): Promise<void | import("express").Response<any, Record<string, any>>>;
}
export {};
