import { Controller } from '@/server/helpers/controller';
declare class Params {
    username: string;
    password: string;
    email: string;
    blocked: boolean;
    isAdmin: boolean;
    roles: any[];
}
export declare class PostAddUserController extends Controller<Params> {
    main(): Promise<void>;
}
export {};
